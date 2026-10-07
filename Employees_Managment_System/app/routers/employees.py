
from itertools import pairwise
from schemas.employee import (
    EmployeeResponse,
    EmployeeCreate,
    EmployeeUpdate,
    EmployeePartialUpdate
)
from database.database import get_db_session
from services.employees_service import (
    get_all_employees,
    get_emp_thorugh_id,
    create_employee,
    delete_employee_data,
    partial_update_emp_by_id,
    update_emp_by_id
)
from sqlalchemy.orm import Session
from typing import Annotated
from models.employee_model import EmployeeBase
from fastapi import APIRouter, Depends, HTTPException, status
# pyrefly: ignore [missing-import]


router = APIRouter(
    prefix="/employees",
    tags=["employees"]
)


@router.get("", response_model=list[EmployeeResponse], status_code=status.HTTP_200_OK)
def get_employees(db: Annotated[Session, Depends(get_db_session)]):
    return get_all_employees(db)


@router.get("/{target_id}", response_model=EmployeeResponse, status_code=status.HTTP_302_FOUND)
def find_employee(db: Annotated[Session, Depends(get_db_session)], target_id: int):

    try:
        return get_emp_thorugh_id(db, target_id)

    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )


@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def add_employee(
    db: Annotated[Session, Depends(get_db_session)],
    employee_data: EmployeeCreate
):
    return create_employee(db, employee_data)


@router.put("/{target_id}", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def update_employee(db: Annotated[Session, Depends(get_db_session)], update_emp: EmployeeUpdate, target_id: int):
    return update_emp_by_id(db, update_emp, target_id)


@router.patch("/{target_id}", status_code=status.HTTP_200_OK, response_model=EmployeeResponse)
def partial_update_employee(db: Annotated[Session, Depends(get_db_session)], partial_update_emp_data: EmployeePartialUpdate, target_id: int):
    try:
        return partial_update_emp_by_id(db, partial_update_emp_data, target_id)

    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error)
        )


@router.delete("/{target_id}", response_model=EmployeeResponse, status_code=status.HTTP_302_FOUND)
def delete_employee(db: Annotated[Session, Depends(get_db_session)], target_id: int):
    return delete_employee_data(db, target_id)
