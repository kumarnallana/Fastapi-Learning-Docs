from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models.department_models import DepartmentsBase
from schemas.departments_schema import DepartmentCreate
from repository.department_repository import (
    get_all_departments_data,
    get_department_by_id,
    create_new_department,
)


def get_all_departments(db: Session):
    return get_all_departments_data(db)


def get_department_through_id(db: Session, department_id: int):
    department = get_department_by_id(db, department_id)
    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Department with id {department_id} not found"
        )
    return department


def create_department(db: Session, department_data: DepartmentCreate):
    new_dept = DepartmentsBase(name=department_data.name)
    return create_new_department(db, new_dept)
