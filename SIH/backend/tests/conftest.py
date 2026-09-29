import os
import sys

# Make `app` importable when running `pytest` from the backend/ directory.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Ensure config doesn't blow up if no .env is present during tests.
os.environ.setdefault("GOOGLE_MAPS_API_KEY", "")
os.environ.setdefault("GEMINI_API_KEY", "")
os.environ.setdefault("FIREBASE_PROJECT_ID", "")
os.environ.setdefault("FIREBASE_CLIENT_EMAIL", "")
os.environ.setdefault("FIREBASE_PRIVATE_KEY", "")
os.environ.setdefault("USE_MOCK_DATA", "false")
