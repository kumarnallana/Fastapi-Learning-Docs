from typing import Annotated
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database.database import get_db_session
from schemas.departments_schema import DeparmentResponse, DepartmentCreate
from services.department_service import (
    get_all_departments,
    get_department_through_id,
    create_department,
)

router = APIRouter(
    prefix="/departments",
    tags=["departments"]
)


@router.get("", response_model=list[DeparmentResponse], status_code=status.HTTP_200_OK)
def get_departments(db: Annotated[Session, Depends(get_db_session)]):
    return get_all_departments(db)


@router.get("/{target_id}", response_model=DeparmentResponse, status_code=status.HTTP_200_OK)
def get_department_by_id_endpoint(
    db: Annotated[Session, Depends(get_db_session)],
    target_id: int
):
    return get_department_through_id(db, target_id)


@router.post("", response_model=DeparmentResponse, status_code=status.HTTP_201_CREATED)
def add_department(
    db: Annotated[Session, Depends(get_db_session)],
    department_data: DepartmentCreate
):
    return create_department(db, department_data)
