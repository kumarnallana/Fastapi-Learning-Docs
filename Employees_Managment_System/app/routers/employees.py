from fastapi import status
from fastapi import APIRouter, Depends
from typing import Annotated
# pyrefly: ignore [missing-import]
from schemas.employee import EmployeeCreate, EmployeeResponse, EmployeePartialUpdate, EmployeeFilters

from database.database import get_db
from sqlalchemy.orm import Session


from services.employees_service import (
    create_new_employee,
    get_all_employees_data,
    get_employee_by_id,
    update_employee_completeData,
    partially_update_empdata,
    delete_employee_by_id,
    filter_employee
)

router = APIRouter(
    prefix="/employees",
    tags=["employees"]
)


@router.get("/test", status_code=status.HTTP_201_CREATED)
def gettind_db(db: Annotated[Session, Depends(get_db)]):
    return {"message": "Database Started From Routers"}


@router.get("", response_model=list[EmployeeResponse])
def get_filtered_emp(filters: Annotated[EmployeeFilters, Depends()]):
    return filter_employee(filters.skip, filters.limit, filters.department, filters.salary)


@router.get("/{target_id}", response_model=EmployeeResponse)
def get_employee(target_id: int):
    return get_employee_by_id(target_id)


@router.post("", status_code=201)
def create_employee(employee: EmployeeCreate):
    return create_new_employee(employee)


@router.put("/{target_id}", response_model=EmployeeResponse)
def update_employee(target_id: int, updated_emp_data: EmployeeCreate):
    return update_employee_completeData(target_id, updated_emp_data)


@router.patch("/{target_id}", response_model=EmployeeResponse)
def partial_update(target_id: int, partial_data: EmployeePartialUpdate):
    return partially_update_empdata(target_id, partial_data)


@router.delete("/{target_id}", response_model=EmployeeResponse)
def delete_employee(target_id: int):
    return delete_employee_by_id(target_id)
