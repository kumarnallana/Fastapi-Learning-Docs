from fastapi import APIRouter
# pyrefly: ignore [missing-import]
from schemas.employee import EmployeeCreate, EmployeeResponse
# pyrefly: ignore [missing-import]
from services.employees_service import (
    create_new_employee,
    get_all_employees_data,
    get_employee_by_id,
    update_employee_completeData
)

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.get("")
def get_employees():
    return get_all_employees_data()


@router.get("/{target_id}", response_model=EmployeeResponse)
def get_employee(target_id: int):
    return get_employee_by_id(target_id)


@router.post("", status_code=201)
def create_employee(employee: EmployeeCreate):
    return create_new_employee(employee)


@router.put("/{target_id}", response_model=EmployeeResponse)
def update_employee(target_id: int, updated_emp_data: EmployeeCreate):
    return update_employee_completeData(target_id, updated_emp_data)

