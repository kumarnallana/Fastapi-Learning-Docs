from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from repository.employee_repository import (
    get_all_employees_data,
    get_employee_by_id,
    create_new_employee,
    update_employee_in_db,
    partial_update_emp,
    deleted_emp_by_id,
)

from models.employee import EmployeeBase
from schemas.employee import (
    EmployeeCreate,
    EmployeeUpdate,
    EmployeePartialUpdate,
    Pagination,
)
from auth.auth_utils import raw_pwd_to_hash


def get_all_employees(db: Session, pagination: Pagination):
    return get_all_employees_data(db, pagination)


def get_emp_thorugh_id(db: Session, employee_id: int):

    employee = get_employee_by_id(db, employee_id)

    # CHECKING WHETHER THE EMPLOYEE IS VALID
    if employee is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={f"message: {employee} not found"}
        )

    return employee


def create_employee(db: Session, employee_data: EmployeeCreate):
    # 1. Hash the incoming plaintext password
    hashed = raw_pwd_to_hash(employee_data.password)

    # 2. Dump all fields except the plain password and id
    data_dict = employee_data.model_dump(exclude={"password", "id"})

    # 3. Create the SQLAlchemy model instance with the hashed password
    db_employee = EmployeeBase(
        **data_dict,
        password_hash=hashed
    )

    # 4. Save via repository
    return create_new_employee(db, db_employee)


def update_emp_by_id(db: Session, update_emp_data: EmployeeUpdate, target_id: int):
    return update_employee_in_db(db, update_emp_data, target_id)


def partial_update_emp_by_id(db: Session, updated_emp_data: EmployeePartialUpdate, target_id: int):

    return partial_update_emp(
        db,
        updated_emp_data,
        target_id
    )


def delete_employee_data(db: Session, target_id: int):
    return deleted_emp_by_id(db, target_id)
