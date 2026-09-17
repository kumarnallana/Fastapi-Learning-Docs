from typing import Any
from fastapi import FastAPI
from models import products, Product

app = FastAPI()


@app.get("/products")
def home():
    return products


@app.get("/products/{id}")
def product_by_id(id: int):
    for product in products:
        if product.id == id:
            return product
    return "Product not found"


@app.post("/products")
def add_product(product: Product):
    products.append(product)
    return product
