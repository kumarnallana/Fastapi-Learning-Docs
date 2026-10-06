from sqlalchemy.orm import Session
from repository.employee_repository import get_all_employees_data, get_employee_by_id, create_new_employee
from models.employee import EmployeeBase


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
