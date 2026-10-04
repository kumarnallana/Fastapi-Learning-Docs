from datetime import date
from pydantic import BaseModel, ConfigDict


class EmployeeBase(BaseModel):
    id: int
    name: str
    role: str
    experience: int
    salary: int | float
    department: str
    joining_date: date


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
    joining_date: date | None = None


class EmployeeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    role: str
    experience: int
    department: str
