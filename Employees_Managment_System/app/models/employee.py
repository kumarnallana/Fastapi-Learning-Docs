from sqlalchemy.orm import Mapped, mapped_column
from database.database import Base
from datetime import date


class EmployeeBase(Base):
    __tablename__ = "Employee_Table"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    role: Mapped[str]
    experience: Mapped[int]
    salary: Mapped[float]
    department: Mapped[str]
    joining_date: Mapped[date]
