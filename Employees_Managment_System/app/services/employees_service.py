from sqlalchemy.orm import Session
from repository.employee_repository import (
    get_all_employees_data,
    get_employee_by_id,
    create_new_employee,
    update_employee_in_db,
    deleted_emp_by_id,
)

from models.employee import EmployeeBase
from schemas.employee import EmployeeUpdate, EmployeePartialUpdate


def get_all_employees(db: Session):
    return get_all_employees_data(db)


def get_emp_thorugh_id(db: Session, employee_id: int):

    employee = get_employee_by_id(db, employee_id)

    # CHECKING WHETHER THE EMPLOYEE IS VALID
    if employee is None:
        raise ValueError(f"{employee} is not found ")

    return employee


def create_employee(db: Session, employee_data: EmployeeBase):
    employee_data = create_new_employee(db, employee_data)

    if not employee_data:
        return []

    return employee_data


def update_emp_by_id(db: Session, update_emp_data: EmployeeUpdate, target_id: int):
    return update_employee_in_db(db, update_emp_data, target_id)


def delete_employee_data(db: Session, target_id: int):
    return deleted_emp_by_id(db, target_id)
