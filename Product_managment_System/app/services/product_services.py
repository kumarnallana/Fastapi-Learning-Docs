from datetime import date
from ..schemas.models import ProductCreate, ProductUpdate
from fastapi import HTTPException

products: list[ProductCreate] = [
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
products_create = products


def product_by_id(target_id: int):
    for product in products:
        if product.id == target_id:
            return product

    raise HTTPException(
        status_code=404,
        detail=f"{target_id}: Product not found",
    )


def add_product_in_db(product: ProductCreate):
    for existing_product in products:
        if existing_product.id == product.id:
            raise HTTPException(
                status_code=409,
                detail=f"Product with id {product.id} already exists",
            )

    products.append(product)

    return product


def update_product_by_id(
    target_id: int,
    updated_product_data: ProductCreate,
):
    for index, product in enumerate(products):
        if product.id == target_id:
            updated_product_data.id = target_id
            products[index] = updated_product_data
            return products[index]

    raise HTTPException(
        status_code=404,
        detail=f"{target_id}: Product not found",
    )


def partial_updated_product(target_id: int, update_product: ProductUpdate):

    for index, product in enumerate(products):

        if product.id == target_id:
            updated_data = update_product.model_dump(exclude_unset=True)
            current_data = product.model_dump()
            current_data.update(updated_data)
            updated_product = ProductCreate(**current_data)
            products[index] = updated_product
            return updated_product
    raise HTTPException(
        status_code=404,
        detail=f"{target_id}: Product not found",
    )


def delete_product_by_id(target_id: int):
    for index, product in enumerate(products):
        if product.id == target_id:
            deleted_product = products.pop(index)
            return deleted_product

    raise HTTPException(
        status_code=404,
        detail=f"{target_id}: Product not found",
    )


def get_product_by_condition(
    category: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
):
    filtered_products: list[ProductCreate] = []

    for product in products:
        category_match = (
            product.category.lower() == category.strip().lower()
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
