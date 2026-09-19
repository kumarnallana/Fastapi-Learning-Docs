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


# Single ProductResponse dictionary
product_response_sample: dict = {
    "id": 101,
    "name": "Milk",
    "price": 65.0,
    "quantity": 20,
    "category": "Dairy",
}

# List of ProductResponse dictionaries (excluding expiry_date)
product_response_data = ProductResponse
product_response_data: list[dict] = [
    {"id": 101, "name": "Milk", "price": 65.0,
        "quantity": 20, "category": "Dairy"},
    {"id": 102, "name": "Bread", "price": 45.0,
        "quantity": 15, "category": "Bakery"},
    {"id": 103, "name": "Rice", "price": 850.0,
        "quantity": 10, "category": "Grains"},
    {"id": 104, "name": "Cooking Oil", "price": 175.5,
        "quantity": 25, "category": "Pantry"},
    {"id": 105, "name": "Biscuits", "price": 30.0,
        "quantity": 40, "category": "Snacks"},
]


products = [
    ProductCreate(
        id=101,
        name="Milk",
        price=65,
        quantity=20,
        expiry_date=date(2026, 9, 25),
        category="Dairy",
    ),
    ProductCreate(
        id=102,
        name="Bread",
        price=45,
        quantity=15,
        expiry_date=date(2026, 9, 21),
        category="Bakery",
    ),
    ProductCreate(
        id=103,
        name="Rice",
        price=850,
        quantity=10,
        expiry_date=date(2027, 3, 15),
        category="Grains",
    ),
    ProductCreate(
        id=104,
        name="Cooking Oil",
        price=175.50,
        quantity=25,
        expiry_date=date(2027, 1, 10),
        category="Pantry",
    ),
    ProductCreate(
        id=105,
        name="Biscuits",
        price=30,
        quantity=40,
        expiry_date=date(2026, 12, 20),
        category="Snacks",
    ),
    ProductCreate(
        id=106,
        name="Yogurt",
        price=40,
        quantity=30,
        expiry_date=date(2026, 9, 28),
        category="Dairy",
    ),
    ProductCreate(
        id=107,
        name="Cheddar Cheese",
        price=210,
        quantity=18,
        expiry_date=date(2026, 11, 15),
        category="Dairy",
    ),
    ProductCreate(
        id=108,
        name="Butter",
        price=58,
        quantity=22,
        expiry_date=date(2026, 10, 30),
        category="Dairy",
    ),
    ProductCreate(
        id=109,
        name="Eggs (Pack of 6)",
        price=54,
        quantity=35,
        expiry_date=date(2026, 10, 5),
        category="Poultry",
    ),
    ProductCreate(
        id=110,
        name="Croissant",
        price=60,
        quantity=12,
        expiry_date=date(2026, 9, 20),
        category="Bakery",
    ),
    ProductCreate(
        id=111,
        name="Bagel",
        price=35,
        quantity=20,
        expiry_date=date(2026, 9, 22),
        category="Bakery",
    ),
    ProductCreate(
        id=112,
        name="Whole Wheat Flour",
        price=320,
        quantity=15,
        expiry_date=date(2027, 2, 28),
        category="Grains",
    ),
    ProductCreate(
        id=113,
        name="Rolled Oats",
        price=145,
        quantity=25,
        expiry_date=date(2027, 4, 10),
        category="Grains",
    ),
    ProductCreate(
        id=114,
        name="Olive Oil",
        price=650,
        quantity=8,
        expiry_date=date(2027, 6, 15),
        category="Pantry",
    ),
    ProductCreate(
        id=115,
        name="Table Salt",
        price=25,
        quantity=50,
        expiry_date=date(2028, 1, 1),
        category="Pantry",
    ),
    ProductCreate(
        id=116,
        name="Granulated Sugar",
        price=50,
        quantity=40,
        expiry_date=date(2027, 12, 31),
        category="Pantry",
    ),
    ProductCreate(
        id=117,
        name="Potato Chips",
        price=20,
        quantity=60,
        expiry_date=date(2026, 11, 25),
        category="Snacks",
    ),
    ProductCreate(
        id=118,
        name="Dark Chocolate Bar",
        price=95,
        quantity=30,
        expiry_date=date(2027, 5, 20),
        category="Snacks",
    ),
    ProductCreate(
        id=119,
        name="Green Tea (25 Bags)",
        price=180,
        quantity=20,
        expiry_date=date(2027, 8, 14),
        category="Beverages",
    ),
    ProductCreate(
        id=120,
        name="Roasted Coffee Beans",
        price=420,
        quantity=15,
        expiry_date=date(2027, 3, 30),
        category="Beverages",
    ),
    ProductCreate(
        id=121,
        name="Apple Juice (1L)",
        price=110,
        quantity=24,
        expiry_date=date(2026, 12, 10),
        category="Beverages",
    ),
    ProductCreate(
        id=122,
        name="Raw Almonds",
        price=480,
        quantity=16,
        expiry_date=date(2027, 5, 5),
        category="Dry Fruits",
    ),
    ProductCreate(
        id=123,
        name="Cashew Nuts",
        price=520,
        quantity=14,
        expiry_date=date(2027, 4, 25),
        category="Dry Fruits",
    ),
    ProductCreate(
        id=124,
        name="Penne Pasta",
        price=95,
        quantity=28,
        expiry_date=date(2027, 7, 18),
        category="Pantry",
    ),
    ProductCreate(
        id=125,
        name="Tomato Ketchup",
        price=85,
        quantity=32,
        expiry_date=date(2027, 2, 15),
        category="Condiments",
    ),
]
