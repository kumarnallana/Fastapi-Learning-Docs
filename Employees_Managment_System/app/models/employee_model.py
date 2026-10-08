from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database.database import Base
from datetime import date
from models.departments_model import Departments


class EmployeeBase(Base):
    __tablename__ = "Employee_Table"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    password_hash: Mapped[int] = mapped_column(String(250), nullable=False)
    role: Mapped[str]
    experience: Mapped[int]
    salary: Mapped[float]
    joining_date: Mapped[date]

    department_id: Mapped[int] = mapped_column(
        ForeignKey("department_table.id"), nullable=False)

    department: Mapped["Departments"] = relationship(
        back_populates="employees")
