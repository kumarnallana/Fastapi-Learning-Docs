from fastapi import FastAPI
from routers.products import router as product_router

app = FastAPI(
    title="FastAPI Learning Project"
)

app.include_router(product_router)
