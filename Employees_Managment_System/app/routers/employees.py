from fastapi import APIRouter
# pyrefly: ignore [missing-import]
from schemas.employee import EmployeeCreate
# pyrefly: ignore [missing-import]
from services.employees_service import (
    create_new_employee,
    get_all_employees_data,
    get_employee_by_id,
)

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.get("")
def get_employees():
    return get_all_employees_data()


@router.get("/{target_id}")
def get_employee(target_id: int):
    return get_employee_by_id(target_id)


@router.post("", status_code=201)
def create_employee(employee: EmployeeCreate):
    return create_new_employee(employee)

