# pyrefly: ignore [missing-import]
from fastapi import FastAPI
from routers.employees import router as employee_router

app = FastAPI(
    title="Welcome to Fast api learning docs!"
)


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to FastAPI Learning Project API",
        "docs_url": "/docs",
    }


app.include_router(employee_router)
