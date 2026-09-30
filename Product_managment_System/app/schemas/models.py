from datetime import date
from pydantic import BaseModel


class ProductCreate(BaseModel):

    id: int
    name: str
    price: int | float
    quantity: int
    expiry_date: date
    category: str


class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    quantity: int
    category: str


class ProductUpdate(BaseModel):
    name: str | None = None
    price: float | None = None
    quantity: int | None = None
    category: str | None = None
    expiry_date: date | None = None
