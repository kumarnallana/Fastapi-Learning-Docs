from models.employee import EmployeeBase
from database.database import SessionLocal
from schemas.employee_schema import EmployeeCreate
from pathlib import Path
import json
from auth.auth_utils import raw_pwd_to_hash


base_dir = Path(__file__).resolve().parent
json_path = base_dir / "local_storage" / "local_db.json"


def local_db_to_db():

    # create a local db session
    db = SessionLocal()
    try:

       # CHECKING WHETHER LOCAL DB JSON FILE IS EXIST OR NOT
        if not json_path.exists():
            raise FileNotFoundError(f"{json_path} is not found!")

    # OPEN LOCAL JSON DATA AND VALIDATE AFTER THAT PUSHING THAT DATA INTO THE DATABASE
        with open(json_path, "r", encoding="utf-8") as file:
            json_data = json.load(file)

        validate_data = [
            EmployeeCreate.model_validate(item) for item in json_data
        ]

        database_storage_data = []

        for employee_data in validate_data:

            employee_dict = employee_data.model_dump(exclude={"password"})

            pwd_hash = raw_pwd_to_hash(employee_data.password)

            db_record = EmployeeBase(
                **employee_dict,
                password_hash=pwd_hash
            )

            database_storage_data.append(db_record)

        db.add_all(database_storage_data)
        db.commit()
        print(
            f"Local data commited to database successully with records of {len(database_storage_data)}!")

    finally:
        db.close()


if __name__ == "__main__":
    local_db_to_db()
    print("commiting operation successfull..!!")
