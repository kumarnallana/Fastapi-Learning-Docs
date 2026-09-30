from fastapi import APIRouter
# pyrefly: ignore [missing-import]
from services.employees_service import get_all_employees_data, get_employee_by_id

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

