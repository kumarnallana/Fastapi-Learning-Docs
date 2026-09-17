from datetime import date
from pydantic import BaseModel


class Product(BaseModel):

    id: int
    name: str
    price: int | float
    quantity: int
    expiry_date: date
    category: str


products = [
    Product(
        id=101,
        name="Milk",
        price=65,
        quantity=20,
        expiry_date=date(2026, 9, 25),
        category="Dairy",
    ),
    Product(
        id=102,
        name="Bread",
        price=45,
        quantity=15,
        expiry_date=date(2026, 9, 21),
        category="Bakery",
    ),
    Product(
        id=103,
        name="Rice",
        price=850,
        quantity=10,
        expiry_date=date(2027, 3, 15),
        category="Grains",
    ),
    Product(
        id=104,
        name="Cooking Oil",
        price=175.50,
        quantity=25,
        expiry_date=date(2027, 1, 10),
        category="Pantry",
    ),
    Product(
        id=105,
        name="Biscuits",
        price=30,
        quantity=40,
        expiry_date=date(2026, 12, 20),
        category="Snacks",
    ),
]
