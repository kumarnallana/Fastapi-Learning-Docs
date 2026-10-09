import json
from pathlib import Path
from typing import Any

from auth.auth_utils import raw_pwd_to_hash
from database.database import SessionLocal
from models.department_models import DepartmentsBase
from models.employee import EmployeeBase
from schemas.departments_schema import DepartmentCreate
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

        # 1. Seed Departments if present
        dept_data_raw = json_data.get("departments", []) if isinstance(json_data, dict) else []
        if dept_data_raw:
            print(f"Loaded {len(dept_data_raw)} departments. Seeding departments...")
            dept_records = []
            for d in dept_data_raw:
                dept_obj = db.get(DepartmentsBase, d["id"])
                if not dept_obj:
                    dept_records.append(DepartmentsBase(id=d["id"], name=d["name"]))
            if dept_records:
                db.add_all(dept_records)
                db.commit()
                print(f"Done! {len(dept_records)} departments seeded successfully.")
            else:
                print("Departments already exist in database, skipping insertion.")

        # 2. Seed Employees
        emp_data_raw = json_data.get("employees", json_data) if isinstance(json_data, dict) else json_data
        validate_data = [
            EmployeeCreate.model_validate(item) for item in emp_data_raw
        ]

        total = len(validate_data)
        print(f"Loaded {total} employee records. Starting Argon2 password hashing...")

        database_storage_data = []

        # Cache identical passwords so Argon2 only runs when passwords actually differ
        pwd_cache: dict[str, str] = {}

        for index, employee_data in enumerate(validate_data, start=1):
            emp_dict: dict[str, Any] = employee_data.model_dump(exclude={"password"})

            # Check cache or hash
            raw_pwd = str(employee_data.password)
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
            f"Done! {len(database_storage_data)} employees seeded successfully."
        )

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e

    finally:
        db.close()


if __name__ == "__main__":
    local_db_to_db()
