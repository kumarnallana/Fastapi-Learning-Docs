from pydantic import HttpUrl
from os import stat
from app.models import ProductCreate, ProductResponse, ProductUpdate, products
from fastapi import FastAPI, HTTPException


app = FastAPI()


@app.get("/products/{target_id}", response_model=ProductResponse)
def product_by_id(target_id: int):
    for product in products:
        if product.id == target_id:
            return product

    raise HTTPException(
        status_code=404,
        detail=f"{target_id}: Product not found",
    )


@app.post("/products", status_code=201)
def add_product(product: ProductCreate):
    for existing_product in products:
        if existing_product.id == product.id:
            raise HTTPException(
                status_code=409,
                detail=f"Product with id {product.id} already exists",
            )

    products.append(product)

    return product


@app.put("/products/{target_id}")
def update_product(
    target_id: int,
    updated_product_data: ProductCreate,
):
    for index, product in enumerate(products):
        if product.id == target_id:
            products[index] = updated_product_data
            return products[index]

    raise HTTPException(
        status_code=404,
        detail=f"{target_id}: Product not found",
    )


@app.patch("/products/{target_id}")
def partial_update_product(target_id: int, update_product: ProductUpdate):

    for index, product in enumerate(products):

        if product.id == target_id:
            updated_data = update_product.model_dump(exclude_unset=True)
            current_data = product.model_dump()
            current_data.update(updated_data)
            updated_product = ProductResponse(**current_data)
            products[index] = updated_product
            return updated_product
    raise HTTPException(
        status_code=404,
        detail=f"{target_id}: Product not found",
    )


@app.delete("/products/{target_id}")
def delete_product(target_id: int):
    for index, product in enumerate(products):
        if product.id == target_id:
            deleted_product = products.pop(index)
            return deleted_product

    raise HTTPException(
        status_code=404,
        detail=f"{target_id}: Product not found",
    )


@app.get("/products", response_model=list[ProductResponse])
def get_by_condition(
    category: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
):
    filtered_products: list[ProductCreate] = []

    for product in products:
        category_match = (
            product.category.lower() == category.lower()
            if category is not None
            else True
        )

        min_price_match = (
            product.price >= min_price
            if min_price is not None
            else True
        )

        max_price_match = (
            product.price <= max_price
            if max_price is not None
            else True
        )

        if (
            category_match
            and min_price_match
            and max_price_match
        ):
            filtered_products.append(product)

    return filtered_products
