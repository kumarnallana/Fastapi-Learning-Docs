from fastapi import APIRouter
from ..schemas.models import ProductCreate, ProductResponse, ProductUpdate
from ..services.product_services import (
    add_product_in_db,
    delete_product_by_id,
    get_product_by_condition,
    partial_updated_product,
    product_by_id,
    update_product_by_id,
)


router = APIRouter(
    prefix="/products",
    tags=["Products"],
)


@router.get("/{target_id}", response_model=ProductResponse)
def get_product(target_id: int):
    return product_by_id(target_id)


@router.post("", status_code=201, response_model=ProductResponse)
def add_product(product: ProductCreate):
    return add_product_in_db(product)


@router.put("/{target_id}", response_model=ProductResponse)
def update_product(
    target_id: int,
    updated_product_data: ProductCreate,
):
    return update_product_by_id(target_id, updated_product_data)


@router.patch("/{target_id}", response_model=ProductResponse)
def partial_update_product(target_id: int, update_product: ProductUpdate):
    return partial_updated_product(target_id, update_product)


@router.delete("/{target_id}", response_model=ProductResponse)
def delete_product(target_id: int):
    return delete_product_by_id(target_id)


@router.get("", response_model=list[ProductResponse])
def get_by_condition(
    category: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
):
    return get_product_by_condition(category, min_price, max_price)
