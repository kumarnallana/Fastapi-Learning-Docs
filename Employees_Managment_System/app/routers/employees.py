from fastapi import APIRouter
# pyrefly: ignore [missing-import]
from schemas.employee import EmployeeCreate, EmployeeResponse, EmployeeUpdate
# pyrefly: ignore [missing-import]
from services.employees_service import (
    create_new_employee,
    delete_employee_by_id,
    get_all_employees_data,
    get_employee_by_id,
    get_employees_by_condition,
    partial_update_employee,
    update_employee_completeData
)

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.get("", response_model=list[EmployeeResponse])
def get_employees(
    department: str | None = None,
    role: str | None = None,
    min_experience: int | None = None,
    max_experience: int | None = None,
):
    return get_employees_by_condition(
        department=department,
        role=role,
        min_experience=min_experience,
        max_experience=max_experience,
    )



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
def partial_update_employee_data(target_id: int, updated_emp_data: EmployeeUpdate):
    return partial_update_employee(target_id, updated_emp_data)


@router.delete("/{target_id}", response_model=EmployeeResponse)
def delete_employee(target_id: int):
    return delete_employee_by_id(target_id)



