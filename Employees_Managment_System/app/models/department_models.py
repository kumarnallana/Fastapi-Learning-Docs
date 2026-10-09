from typing import TYPE_CHECKING
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, Relationship
from database.database import Base

if TYPE_CHECKING:
    from models.employee import EmployeeBase


class DepartmentsBase(Base):

    __tablename__ = "Department_Table"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)

    employees: Mapped[list["EmployeeBase"]] = Relationship(
        back_populates="departments")
