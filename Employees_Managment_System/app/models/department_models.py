from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase, Relationship
from models.employee import EmployeeBase


class DepartmentsBase(DeclarativeBase):

    __tablename__ = "Department_Table"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    name: Mapped[str] = mapped_column(min_length=2, nullable=False)

    employees: Mapped[list["EmployeeBase"]] = Relationship(
        back_populates="departments")
