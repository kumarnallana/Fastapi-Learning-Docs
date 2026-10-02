from pydantic import BaseModel


class EmployeeCreate(BaseModel):
    id: int
    name: str
    role: str
    experience: int
    salary: int | float
    department: str
    joinning_date: int


class EmployeeUpdate(BaseModel):
    id: int
    name: str
    role: str
    experience: int
    salary: int | float
    department: str
    joinning_date: int


class EmployeePartialUpdate(BaseModel):
    name: str | None = None
    role: str | None = None
    experience: int | None = None
    salary: int | float | None = None
    department: str | None = None
    joinning_date: int | None = None


class EmployeeResponse(BaseModel):
    id: int
    name: str
    role: str
    experience: int
    department: str
