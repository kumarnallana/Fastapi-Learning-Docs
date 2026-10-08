import json
from pathlib import Path
from typing import Any

from auth.auth_utils import raw_pwd_to_hash
from database.database import SessionLocal
from models.employee import EmployeeBase
from schemas.employee_schema import EmployeeCreate

base_dir = Path(__file__).resolve().parent
json_path = base_dir / "local_storage" / "local_db.json"


def local_db_to_db():
    if not json_path.exists():
        raise FileNotFoundError(f"{json_path} is not found!")

    db = SessionLocal()
    try:
        with open(json_path, "r", encoding="utf-8") as file:
            json_data = json.load(file)

        validate_data = [
            EmployeeCreate.model_validate(item) for item in json_data
        ]

        total = len(validate_data)
        print(f"Loaded {total} records. Starting Argon2 password hashing...")

        database_storage_data = []

        # Cache identical passwords so Argon2 only runs when passwords actually differ
        pwd_cache: dict[str, str] = {}

        for index, employee_data in enumerate(validate_data, start=1):
            emp_dict: dict[str, Any] = employee_data.model_dump(exclude={
                                                                "password"})

            # Check cache or hash
            raw_pwd = employee_data.password
            if raw_pwd not in pwd_cache:
                pwd_cache[raw_pwd] = raw_pwd_to_hash(raw_pwd)

            db_record = EmployeeBase(
                **emp_dict,
                password_hash=pwd_cache[raw_pwd]
            )
            database_storage_data.append(db_record)

            if index % 10 == 0 or index == total:
                print(f"Progress: [{index}/{total}] records hashed...")

        print("Writing records to PostgreSQL...")
        db.add_all(database_storage_data)
        db.commit()

        print(
            f"Done! {len(database_storage_data)} employees seeded successfully.")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e

    finally:
        db.close()


if __name__ == "__main__":
    local_db_to_db()
