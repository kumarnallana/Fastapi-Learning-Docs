from typing import Any
from fastapi import FastAPI, HTTPException
from models import products, Product

app = FastAPI()


@app.get("/products")
def home():
    return products


@app.get("/products/{product_id}")
def product_by_id(product_id: int):

    for product in products:
        if product.id == product_id:
            return product
    raise HTTPException(
        status_code=404,
        detail=f"{product_id}: Product Not found"
    )


@app.post("/products")
def add_product(product: Product):
    products.append(product)
    return product
