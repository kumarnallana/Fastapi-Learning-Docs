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
from models.employee_model import EmployeeBase
from schemas.employee import (
    EmployeeCreate,
    EmployeeUpdate,
    EmployeePartialUpdate
)
from auth.auth_utils import password_to_hash


def get_all_employees(db: Session):
    return get_all_employees_data(db)


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

    if not employee_data:
        return []

    # HASHING PLAIN RAW PWD INTO THE HASHED PASSWORD
    hashed_pwd = password_to_hash(employee_data.password)

    current_emp_dict = employee_data.model_dump(exclude={"password"})

    mew_emp_data = EmployeeBase(
        **current_emp_dict,
        password_hash=hashed_pwd
    )

    return create_new_employee(db, mew_emp_data)


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
