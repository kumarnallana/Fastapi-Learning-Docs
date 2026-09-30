from fastapi import APIRouter
from services.employees_service import get_all_employees_data

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.get("")
def get_employees():
    return get_all_employees_data()

