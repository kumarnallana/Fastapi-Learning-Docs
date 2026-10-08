from sqlalchemy.orm import relationship
from database.database import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String
from models.employee_model import EmployeeBase


class Departments(Base):

    __tablename__ = "department_table"

    id: Mapped[int] = mapped_column(nullable=False, primary_key=True)
    name: Mapped[str] = mapped_column(String(50), min_length=2)

    employees: Mapped[list["EmployeeBase"]] = relationship(
        back_populates="employees")
