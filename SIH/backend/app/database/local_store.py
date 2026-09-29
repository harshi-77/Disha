import json
import os
import threading
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

STORE_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "disha_store.json")
_lock = threading.Lock()

def _ensure_dir():
    d = os.path.dirname(STORE_PATH)
    if not os.path.exists(d):
        os.makedirs(d, exist_ok=True)

class LocalDocSnapshot:
    def __init__(self, doc_id: str, data: Optional[Dict[str, Any]]):
        self.id = doc_id
        self._data = data

    @property
    def exists(self) -> bool:
        return self._data is not None

    def to_dict(self) -> Dict[str, Any]:
        return dict(self._data) if self._data else {}

class LocalDocRef:
    def __init__(self, client: "LocalFirestoreClient", path: List[str]):
        self._client = client
        self._path = path  # e.g. ["users", "uid1", "trips", "trip1"]
        self.id = path[-1]

    def set(self, data: Dict[str, Any], merge: bool = False):
        self._client._set_doc(self._path, data, merge=merge)

    def get(self) -> LocalDocSnapshot:
        data = self._client._get_doc(self._path)
        return LocalDocSnapshot(self.id, data)

    def update(self, data: Dict[str, Any]):
        self._client._update_doc(self._path, data)

    def delete(self):
        self._client._delete_doc(self._path)

    def collection(self, col_name: str) -> "LocalCollectionRef":
        return LocalCollectionRef(self._client, self._path + [col_name])

class LocalCollectionRef:
    def __init__(self, client: "LocalFirestoreClient", path: List[str]):
        self._client = client
        self._path = path
        self._order_field = None
        self._order_desc = False
        self._limit_count = None

    def document(self, doc_id: Optional[str] = None) -> LocalDocRef:
        if not doc_id:
            doc_id = f"doc_{int(datetime.now(timezone.utc).timestamp() * 1000)}"
        return LocalDocRef(self._client, self._path + [doc_id])

    def order_by(self, field: str, direction: str = "ASCENDING") -> "LocalCollectionRef":
        new_ref = LocalCollectionRef(self._client, self._path)
        new_ref._order_field = field
        new_ref._order_desc = (direction.upper() == "DESCENDING")
        new_ref._limit_count = self._limit_count
        return new_ref

    def limit(self, count: int) -> "LocalCollectionRef":
        new_ref = LocalCollectionRef(self._client, self._path)
        new_ref._order_field = self._order_field
        new_ref._order_desc = self._order_desc
        new_ref._limit_count = count
        return new_ref

    def stream(self):
        docs = self._client._list_docs(self._path)
        if self._order_field:
            docs.sort(
                key=lambda x: str(x[1].get(self._order_field, "")),
                reverse=self._order_desc
            )
        if self._limit_count:
            docs = docs[:self._limit_count]
        for doc_id, data in docs:
            yield LocalDocSnapshot(doc_id, data)

    def get(self) -> List[LocalDocSnapshot]:
        return list(self.stream())

    def add(self, data: Dict[str, Any]):
        doc_id = f"doc_{int(datetime.now(timezone.utc).timestamp() * 1000)}"
        doc_ref = self.document(doc_id)
        doc_ref.set(data)
        return (datetime.now(timezone.utc), doc_ref)

class LocalFirestoreClient:
    def __init__(self):
        _ensure_dir()
        self._data: Dict[str, Any] = self._load()

    def _load(self) -> Dict[str, Any]:
        with _lock:
            if os.path.exists(STORE_PATH):
                try:
                    with open(STORE_PATH, "r", encoding="utf-8") as f:
                        return json.load(f)
                except Exception:
                    return {}
            # Initialize with default sample data
            return {
                "incidents": {
                    "inc_1": {
                        "incident_id": "inc_1",
                        "type": "pothole",
                        "title": "Pothole Cluster near Sony World",
                        "lat": 12.9345, "lng": 77.6250,
                        "severity": "medium",
                        "reported_by": "pilot_system",
                        "reported_at": "2026-09-26T12:00:00Z",
                        "verified": True
                    },
                    "inc_2": {
                        "incident_id": "inc_2",
                        "type": "waterlog",
                        "title": "Monsoon Waterlogging on Bellandur ORR",
                        "lat": 12.9260, "lng": 77.6762,
                        "severity": "high",
                        "reported_by": "pilot_system",
                        "reported_at": "2026-09-26T14:30:00Z",
                        "verified": True
                    }
                },
                "users": {}
            }

    def _save(self):
        with _lock:
            try:
                _ensure_dir()
                with open(STORE_PATH, "w", encoding="utf-8") as f:
                    json.dump(self._data, f, indent=2, default=str)
            except Exception as e:
                print("Error saving local store:", e)

    def _traverse(self, path: List[str], create_missing: bool = False) -> Optional[Dict[str, Any]]:
        curr = self._data
        for p in path:
            if p not in curr:
                if create_missing:
                    curr[p] = {}
                else:
                    return None
            curr = curr[p]
        return curr

    def _get_doc(self, path: List[str]) -> Optional[Dict[str, Any]]:
        doc_node = self._traverse(path)
        if isinstance(doc_node, dict):
            # Return copy without subcollections (subcollections are nested dicts with dict values)
            out = {}
            for k, v in doc_node.items():
                if not isinstance(v, dict) or not any(isinstance(sub, dict) for sub in v.values()):
                    out[k] = v
            return out
        return None

    def _set_doc(self, path: List[str], data: Dict[str, Any], merge: bool = False):
        parent_path = path[:-1]
        doc_id = path[-1]
        parent_node = self._traverse(parent_path, create_missing=True)
        if parent_node is not None:
            if merge and doc_id in parent_node and isinstance(parent_node[doc_id], dict):
                parent_node[doc_id].update(data)
            else:
                parent_node[doc_id] = dict(data)
            self._save()

    def _update_doc(self, path: List[str], data: Dict[str, Any]):
        parent_path = path[:-1]
        doc_id = path[-1]
        parent_node = self._traverse(parent_path, create_missing=False)
        if parent_node is not None and doc_id in parent_node and isinstance(parent_node[doc_id], dict):
            parent_node[doc_id].update(data)
            self._save()

    def _delete_doc(self, path: List[str]):
        parent_path = path[:-1]
        doc_id = path[-1]
        parent_node = self._traverse(parent_path, create_missing=False)
        if parent_node is not None and doc_id in parent_node:
            del parent_node[doc_id]
            self._save()

    def _list_docs(self, col_path: List[str]) -> List[tuple]:
        col_node = self._traverse(col_path)
        if not isinstance(col_node, dict):
            return []
        items = []
        for k, v in col_node.items():
            if isinstance(v, dict):
                items.append((k, v))
        return items

    def collection(self, name: str) -> LocalCollectionRef:
        return LocalCollectionRef(self, [name])

    def collections(self) -> List[LocalCollectionRef]:
        return [LocalCollectionRef(self, [k]) for k in self._data.keys()]
