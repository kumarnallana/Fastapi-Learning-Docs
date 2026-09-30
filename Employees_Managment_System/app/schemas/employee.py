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


class EmployeeResponse(BaseModel):
    id: int
    name: str
    role: str
    experience: int
    department: str
