import json
from pathlib import Path
from typing import Any

from sqlalchemy import select, text
from auth.auth_utils import raw_pwd_to_hash
from database.database import SessionLocal, engine
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
        dept_data_raw = json_data.get(
            "departments", []) if isinstance(json_data, dict) else []
        if dept_data_raw:
            existing_dept_ids = set(db.scalars(
                select(DepartmentsBase.id)).all())
            dept_records = [
                DepartmentsBase(id=d["id"], name=d["name"])
                for d in dept_data_raw
                if d["id"] not in existing_dept_ids
            ]
            if dept_records:
                print(
                    f"Loaded {len(dept_data_raw)} departments. Seeding {len(dept_records)} new departments...")
                db.add_all(dept_records)
                db.commit()
                print(
                    f"Done! {len(dept_records)} departments seeded successfully.")
            else:
                print("Departments already exist in database, skipping insertion.")

        # 2. Seed Employees
        emp_data_raw = json_data.get("employees", json_data) if isinstance(
            json_data, dict) else json_data
        validate_data = [
            EmployeeCreate.model_validate(item) for item in emp_data_raw
        ]

        # Fast batch check for existing employee IDs
        existing_emp_ids = set(db.scalars(select(EmployeeBase.id)).all())
        employees_to_seed = [
            emp for emp in validate_data if emp.id not in existing_emp_ids
        ]

        if not employees_to_seed:
            print("All employees already exist in database, skipping insertion.")
        else:
            total = len(employees_to_seed)
            print(
                f"Seeding {total} new employee records. Starting Argon2 password hashing...")

            database_storage_data = []

            # Cache identical passwords so Argon2 only runs when passwords actually differ
            pwd_cache: dict[str, str] = {}

            for index, employee_data in enumerate(employees_to_seed, start=1):
                emp_dict: dict[str, Any] = employee_data.model_dump(exclude={
                                                                    "password"})

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

        # 3. Synchronize Postgres auto-increment sequences with current MAX(id)
        with engine.connect() as conn:
            conn.execute(
                text('SELECT setval(pg_get_serial_sequence(\'"Department_Table"\', \'id\'), COALESCE(MAX(id), 1)) FROM "Department_Table"')
            )
            conn.execute(
                text('SELECT setval(pg_get_serial_sequence(\'"Employee_Table"\', \'id\'), COALESCE(MAX(id), 1)) FROM "Employee_Table"')
            )
            conn.commit()
        print("Synchronized PostgreSQL ID sequences successfully.")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e

    finally:
        db.close()


if __name__ == "__main__":
    local_db_to_db()
