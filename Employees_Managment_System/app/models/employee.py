from sqlalchemy import ForeignKey
from typing import TYPE_CHECKING
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, Relationship
from database.database import Base
from datetime import date

if TYPE_CHECKING:
    from models.department_models import DepartmentsBase


class EmployeeBase(Base):
    __tablename__ = "Employee_Table"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    password_hash: Mapped[str] = mapped_column(String(250), nullable=False)
    role: Mapped[str]
    experience: Mapped[int]
    salary: Mapped[float]
    joining_date: Mapped[date]

    # CREATING A RELATION BETWEEN THE DEPARTMENT ID TO THE EMPLOYEE
    department_id: Mapped[int] = mapped_column(
        ForeignKey("Department_Table.id"), nullable=False)

    # IMPLEMENTED THE EmployeeBase.DepartmentsBase ACCESS WHERE WE CAN ACCESS A EMP DepartmentsBase
    departments: Mapped["DepartmentsBase"] = Relationship(
        back_populates="employees")
