from fastapi import HTTPException, status
from models.employee import EmployeeBase
from sqlalchemy.orm import Session
from sqlalchemy import select
from schemas.employee import EmployeeUpdate, EmployeePartialUpdate


def get_all_employees_data(db: Session):

    # WRITING A SELECT QUERY TO RETRIVE DATA FROM THE DATABASE
    statement = select(EmployeeBase)  # -> SELECT * FROM EmployeeBase

    # EXECUTING STATEMENT
    exec_statement = db.execute(statement)

    # CONVETING DATABASE ROWS INTO THE SQLALCHMENY MODEL OBJECTS
    employee_obj = exec_statement.scalars().all()

    return employee_obj


# GET EMPLOYEE THROUGH id
def get_employee_by_id(db: Session, employee_id: int):
    try:
        employee = db.get(EmployeeBase, employee_id)
        return employee

    except Exception as error:
        return f"Error: {error}"


# CREATE NEW EMP DATA
def create_new_employee(db: Session, employee_data: EmployeeBase):

    # ADDING CURRENT EMPLOYEES DATA INTO THE DATABASE
    db.add(employee_data)
    db.commit()
    db.refresh(employee_data)

    return employee_data


# UPDATE EMPLOYEE THROUGH  ID
def update_employee_in_db(db: Session, updated_emp: EmployeeUpdate, target_id: int):

    employee_data = db.get(EmployeeBase, target_id)

    current_data: dict = updated_emp.model_dump()

    if employee_data is None:
        return None

    for field, value in current_data.items():
        setattr(employee_data, field, value)

    db.commit()
    db.refresh(employee_data)

    return employee_data

# DELETE EMPLOYEE THROUGH  ID


def deleted_emp_by_id(db: Session, target_id: int):

    employee_data = db.get(EmployeeBase, target_id)

    if employee_data is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with id {target_id} does not exist"
        )

    db.delete(employee_data)
    db.commit()

    return employee_data
