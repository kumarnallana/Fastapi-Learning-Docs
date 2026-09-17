from typing import Any
from fastapi import FastAPI, HTTPException
from models import products, Product

app = FastAPI()


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
            product.category.lower() == category.lower()

        if price_match and category_match:
            filter_products.append(product)

    return filter_products


@app.get("/products/{target_id}")
def product_by_id(target_id: int):

    for product in products:
        if product.id == target_id:
            return product

    return products


@app.post("/products")
def add_product(product: Product):
    products.append(product)
    raise HTTPException(
        status_code=201,
        detail=f"product_id:{product.id} Created Successfully"
    )


@app.put("/products/{target_id}")
def update_product(target_id: int, updated_product_data: Product):
    try:
        for i, product in enumerate(products):
            if product.id == target_id:
                products[i] = updated_product_data
                return products[i]

        raise HTTPException(
            status_code=404,
            detail=f"{target_id}: Product Not found"
        )

    except Exception as e:
        return e


@app.delete("/products/{target_id}")
def delete_product(target_id: int):
    try:
        for i, product in enumerate(products):
            if product.id == target_id:
                del products[i]
                return products

        raise HTTPException(
            status_code=404,
            detail=f"{target_id}: Product Not found"
        )

    except Exception as e:
        return e
