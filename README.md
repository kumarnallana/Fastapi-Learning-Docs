# FastAPI Learning Docs & Starter Project

A clean, modular starter repository designed for learning FastAPI step by step, following the official FastAPI "Bigger Applications" architecture.

---

## 📁 Project Structure

```text
Fastapi-Learning-Docs/
├── .venv/                      # Python virtual environment (auto-created)
├── .gitignore                  # Git rules to ignore .venv, cache, etc.
├── requirements.txt            # Project dependencies (FastAPI, Uvicorn, HTTPX)
├── README.md                   # Learning guide and documentation
└── app/
    ├── __init__.py             # Makes app a Python package
    ├── main.py                 # FastAPI application instance & route registration
    ├── routers/                # Topic-based modules for hands-on practice
    │   ├── __init__.py
    │   ├── basics.py           # Path parameters, query parameters, validation
    │   └── items.py            # Complete CRUD with in-memory state
    └── schemas/                # Pydantic data schemas
        ├── __init__.py
        └── item.py             # ItemCreate, ItemResponse, ItemUpdate models
```

---

## 🚀 Quick Start Guide

### 1. Activate the Virtual Environment

**In PowerShell:**
```powershell
.\.venv\Scripts\Activate.ps1
```
*(If you see an execution policy error in PowerShell, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` first)*

**In Command Prompt (CMD):**
```cmd
.venv\Scripts\activate.bat
```

### 2. Run the Development Server

Start the Uvicorn ASGI server with live auto-reload enabled:

```bash
uvicorn app.main:app --reload
```
*Or run directly with Python:*
```bash
python -m app.main
```

### 3. Open Interactive API Documentation

Once the server is running, open your browser and navigate to:

- **Swagger UI (Interactive Playground):** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc (Alternative Documentation):** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **Raw JSON Schema:** [http://127.0.0.1:8000/openapi.json](http://127.0.0.1:8000/openapi.json)

---

## 🧭 What's Included in this Starter

| Route | Method | Description | Learning Topic |
|---|---|---|---|
| `/` | `GET` | Welcome message and navigation index | Root endpoint |
| `/basics/` | `GET` | Overview of basic concepts | Basic responses |
| `/basics/users/{user_id}` | `GET` | Fetch user by numeric ID | Path parameters & validation |
| `/basics/search` | `GET` | Search with query string & limits | Query parameters & constraints |
| `/items/` | `GET` | List all items | `response_model` with lists |
| `/items/{item_id}` | `GET` | Get single item by ID | 404 error handling |
| `/items/` | `POST` | Create a new item | Request body validation (`ItemCreate`) |
| `/items/{item_id}` | `PUT` | Update existing item | Partial update & schema validation |
| `/items/{item_id}` | `DELETE` | Delete item | HTTP 204 No Content response |

---

## 🛠 Adding New Learning Topics

1. **Add a new schema:** Create a model in `app/schemas/` using `pydantic.BaseModel`.
2. **Add a new router:** Create a file in `app/routers/` (e.g., `app/routers/auth.py`), define `router = APIRouter(...)`.
3. **Register the router:** In `app/main.py`, include your new router with `app.include_router(your_router)`.