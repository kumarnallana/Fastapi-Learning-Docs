from datetime import date
from pydantic import BaseModel, Field, ConfigDict
from typing import Annotated


class EmployeeBase(BaseModel):
    id: Annotated[int, Field(gt=3)]
    name: Annotated[str, Field(min_length=1, max_length=50)]
    role: Annotated[str, Field(min_length=1, max_length=30)]
    experience: Annotated[int, Field(gt=2)]
    salary: Annotated[int, Field(gt=200000)]
    department: Annotated[str, Field(min_length=1, max_length=30)]
    joining_date: Annotated[
        date,
        Field(gt=date(2000, 1, 1))
    ]


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(EmployeeBase):
    pass


class EmployeePartialUpdate(BaseModel):
    name: str | None = None
    role: str | None = None
    experience: int | None = None
    salary: int | float | None = None
    department: str | None = None
    joining_date: int | None = None


class EmployeeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    role: str
    experience: int
    department: str
