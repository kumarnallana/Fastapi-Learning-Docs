
from typing import Any
from fastapi import FastAPI, HTTPException
from models import products, Product

app = FastAPI()


@app.get("/products/{target_id}")
def product_by_id(target_id: int):

    for product in products:
        if product.id == target_id:
            return product

    raise HTTPException(
        status_code=404,
        detail=f"{target_id}: Product Not found"
    )


@app.post("/products", status_code=201)
def add_product(product: Product):
    products.append(product)

    for existing_product in products:
        if existing_product.id == product.id:
            raise HTTPException(
                status_code=409,
                detail=f"Product with id {product.id} already exists",
            )
    return products


@app.put("/products/{target_id}")
def update_product(target_id: int, updated_product_data: Product):
    for i, product in enumerate(products):
        if product.id == target_id:
            products[i] = updated_product_data
            return products[i]

    raise HTTPException(
        status_code=404,
        detail=f"{target_id}: Product Not found"
    )


@app.delete("/products/{target_id}")
def delete_product(target_id: int):

    for i, product in enumerate(products):
        if product.id == target_id:
            del products[i]
            return products

    raise HTTPException(
        status_code=404,
        detail=f"{target_id}: Product Not found"
    )


@app.get("/products")
def get_by_condition(
    category: str | None = None,
    min_price: float = 0,
    max_price: float = 100
):
    filter_products: list[Product] = []

    for product in products:
        price_match = min_price <= product.price <= max_price

        category_match = True

        if category is not None:
            category_match = product.category.lower() == category.lower()

        if price_match and category_match:
            filter_products.append(product)

    return filter_products
