from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, Relationship
from database.database import Base
from datetime import date


class EmployeeBase(Base):
    __tablename__ = "Employee_Table"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    password_hash: Mapped[str] = mapped_column(String(250), nullable=False)
    role: Mapped[str]
    experience: Mapped[int]
    salary: Mapped[float]
    department_id: Mapped[int] = mapped_column()
    department: Mapped[str]
    joining_date: Mapped[date]
