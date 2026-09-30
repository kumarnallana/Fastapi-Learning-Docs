from fastapi import FastAPI
from .routers.products import router as product_router

app = FastAPI(
    title="FastAPI Learning Project"
)


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to FastAPI Learning Project API",
        "docs_url": "/docs",
    }


app.include_router(product_router)
