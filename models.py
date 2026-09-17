from pydantic import BaseModel


class Product(BaseModel):

    id: int
    name: str
    price: int | float
    quantity: int
    expiry_date: str


products = [
    Product(
        id=101,
        name="Milk",
        price=65,
        quantity=20,
        expiry_date="2026-09-25",
    ),
    Product(
        id=102,
        name="Bread",
        price=45,
        quantity=15,
        expiry_date="2026-09-21",
    ),
    Product(
        id=103,
        name="Rice",
        price=850,
        quantity=10,
        expiry_date="2027-03-15",
    ),
    Product(
        id=104,
        name="Cooking Oil",
        price=175.50,
        quantity=25,
        expiry_date="2027-01-10",
    ),
    Product(
        id=105,
        name="Biscuits",
        price=30,
        quantity=40,
        expiry_date="2026-12-20",
    ),
]
