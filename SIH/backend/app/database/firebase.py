import firebase_admin
from firebase_admin import credentials, firestore, auth
from app.config import get_settings
from app.utils.logging import get_logger
from app.database.local_store import LocalFirestoreClient

logger = get_logger(__name__)
_db = None
_local_db = None

class ResilientFirestoreWrapper:
    """
    Wraps Cloud Firestore and automatically falls back to LocalFirestoreClient
    if Cloud Firestore API is disabled or inaccessible on Google Cloud.
    """
    def __init__(self, cloud_db, local_db):
        self._cloud_db = cloud_db
        self._local_db = local_db
        self._cloud_healthy = (cloud_db is not None)

    def collection(self, name: str):
        if self._cloud_healthy and self._cloud_db:
            try:
                # Wrap the collection ref to catch errors during stream/set/get
                return _ResilientCollectionRef(self._cloud_db.collection(name), self._local_db.collection(name), self)
            except Exception as e:
                logger.warning(f"Cloud Firestore collection error: {e}. Switching to local store.")
                self._cloud_healthy = False
        return self._local_db.collection(name)

    def collections(self):
        if self._cloud_healthy and self._cloud_db:
            try:
                return list(self._cloud_db.collections())
            except Exception as e:
                logger.warning(f"Cloud Firestore collections query error: {e}. Switching to local store.")
                self._cloud_healthy = False
        return self._local_db.collections()

class _ResilientCollectionRef:
    def __init__(self, cloud_ref, local_ref, parent_wrapper):
        self._cloud = cloud_ref
        self._local = local_ref
        self._parent = parent_wrapper

    def document(self, doc_id=None):
        if self._parent._cloud_healthy and self._cloud:
            try:
                cloud_doc = self._cloud.document(doc_id) if doc_id else self._cloud.document()
                local_doc = self._local.document(doc_id or getattr(cloud_doc, 'id', None))
                return _ResilientDocRef(cloud_doc, local_doc, self._parent)
            except Exception as e:
                logger.warning(f"Cloud Firestore document error: {e}. Using local store.")
                self._parent._cloud_healthy = False
        return self._local.document(doc_id)

    def order_by(self, field, direction="ASCENDING"):
        try:
            if self._parent._cloud_healthy and self._cloud:
                return _ResilientCollectionRef(self._cloud.order_by(field, direction=direction), self._local.order_by(field, direction=direction), self._parent)
        except Exception:
            self._parent._cloud_healthy = False
        return self._local.order_by(field, direction=direction)

    def limit(self, count):
        try:
            if self._parent._cloud_healthy and self._cloud:
                return _ResilientCollectionRef(self._cloud.limit(count), self._local.limit(count), self._parent)
        except Exception:
            self._parent._cloud_healthy = False
        return self._local.limit(count)

    def stream(self):
        if self._parent._cloud_healthy and self._cloud:
            try:
                docs = list(self._cloud.stream())
                for d in docs:
                    yield d
                return
            except Exception as e:
                logger.warning(f"Cloud Firestore stream error: {e}. Falling back to local store.")
                self._parent._cloud_healthy = False
        for d in self._local.stream():
            yield d

    def add(self, data):
        if self._parent._cloud_healthy and self._cloud:
            try:
                return self._cloud.add(data)
            except Exception as e:
                logger.warning(f"Cloud Firestore add error: {e}. Falling back to local store.")
                self._parent._cloud_healthy = False
        return self._local.add(data)

class _ResilientDocRef:
    def __init__(self, cloud_doc, local_doc, parent_wrapper):
        self._cloud = cloud_doc
        self._local = local_doc
        self._parent = parent_wrapper
        self.id = getattr(cloud_doc, 'id', getattr(local_doc, 'id', ''))

    def set(self, data, merge=False):
        if self._parent._cloud_healthy and self._cloud:
            try:
                res = self._cloud.set(data, merge=merge)
                # Also sync locally for persistence
                self._local.set(data, merge=merge)
                return res
            except Exception as e:
                logger.warning(f"Cloud Firestore set error: {e}. Falling back to local store.")
                self._parent._cloud_healthy = False
        return self._local.set(data, merge=merge)

    def get(self):
        if self._parent._cloud_healthy and self._cloud:
            try:
                return self._cloud.get()
            except Exception as e:
                logger.warning(f"Cloud Firestore get error: {e}. Falling back to local store.")
                self._parent._cloud_healthy = False
        return self._local.get()

    def update(self, data):
        if self._parent._cloud_healthy and self._cloud:
            try:
                res = self._cloud.update(data)
                self._local.update(data)
                return res
            except Exception as e:
                logger.warning(f"Cloud Firestore update error: {e}. Falling back to local store.")
                self._parent._cloud_healthy = False
        return self._local.update(data)

    def delete(self):
        if self._parent._cloud_healthy and self._cloud:
            try:
                res = self._cloud.delete()
                self._local.delete()
                return res
            except Exception as e:
                logger.warning(f"Cloud Firestore delete error: {e}. Falling back to local store.")
                self._parent._cloud_healthy = False
        return self._local.delete()

    def collection(self, col_name: str):
        if self._parent._cloud_healthy and self._cloud:
            try:
                return _ResilientCollectionRef(self._cloud.collection(col_name), self._local.collection(col_name), self._parent)
            except Exception:
                self._parent._cloud_healthy = False
        return self._local.collection(col_name)

def initialize_firebase():
    global _db, _local_db
    _local_db = LocalFirestoreClient()
    
    settings = get_settings()
    if not settings.firebase_project_id or not settings.firebase_client_email or not settings.firebase_private_key:
        logger.warning("Firebase credentials not configured. Using persistent local store.")
        _db = _local_db
        return

    try:
        if not firebase_admin._apps:
            cred_dict = {
                "type": "service_account",
                "project_id": settings.firebase_project_id,
                "client_email": settings.firebase_client_email,
                "private_key": settings.firebase_private_key.replace("\\n", "\n"),
                "token_uri": "https://oauth2.googleapis.com/token",
            }
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin initialized successfully.")

        raw_cloud_db = firestore.client()
        # Verify if Firestore API is actually active on Google Cloud
        try:
            list(raw_cloud_db.collections())
            logger.info("Cloud Firestore connection active and verified.")
            _db = ResilientFirestoreWrapper(raw_cloud_db, _local_db)
        except Exception as cloud_err:
            logger.warning(f"Cloud Firestore API not enabled on Google Cloud ({cloud_err}). Using resilient local storage fallback.")
            _db = _local_db
    except Exception as e:
        logger.error(f"Firebase initialization error: {e}. Using resilient local store.")
        _db = _local_db

def get_db():
    global _db
    if _db is None:
        initialize_firebase()
    return _db

def get_auth():
    return auth

