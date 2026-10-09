from sqlalchemy import select
from sqlalchemy.orm import Session
from models.department_models import DepartmentsBase


def get_all_departments_data(db: Session):
    statement = select(DepartmentsBase).order_by(DepartmentsBase.id)
    result = db.execute(statement)
    return result.scalars().all()


def get_department_by_id(db: Session, department_id: int):
    return db.get(DepartmentsBase, department_id)


def create_new_department(db: Session, department_data: DepartmentsBase):
    db.add(department_data)
    db.commit()
    db.refresh(department_data)
    return department_data
