from models.employee import EmployeeBase
from fastapi import status
from fastapi import APIRouter, Depends
from typing import Annotated
# pyrefly: ignore [missing-import]
from schemas.employee import EmployeeResponse, EmployeeCreate

from sqlalchemy.orm import Session
from services.employees_service import get_all_employees, get_emp_thorugh_id, create_employee
from database.database import get_db_session


router = APIRouter(
    prefix="/employees",
    tags=["employees"]
)


@router.get("", response_model=list[EmployeeResponse])
def get_employees(db: Annotated[Session, Depends(get_db_session)]):
    return get_all_employees(db)


@router.get("/{target_id}", response_model=EmployeeResponse)
def find_employee(db: Annotated[Session, Depends(get_db_session)], target_id: int):
    return get_emp_thorugh_id(db, target_id)


@router.put("", response_model=EmployeeResponse)
def add_employee_data(db: Annotated[Session, Depends(get_db_session)], employee_data: EmployeeCreate):
    employe_dict = employee_data.model_dump()

    employee = EmployeeBase(**employe_dict)

    return create_employee(db, employee)
