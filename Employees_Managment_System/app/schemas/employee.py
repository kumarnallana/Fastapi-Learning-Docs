from pydantic import Field
from fastapi import Query
from typing import Annotated
from datetime import date
from pydantic import BaseModel, ConfigDict


class EmployeeBase(BaseModel):
    id: int
    name: str
    hashed_password: str
    role: str
    experience: int
    salary: int | float
    department: str
    joining_date: date


class EmployeeCreate(BaseModel):
    name: str
    password: str = Field(..., min_length=8, description="User raw password")
    role: str
    experience: int
    salary: int | float
    department: str
    joining_date: date


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


class EmployeeFilters(BaseModel):
    skip: Annotated[
        int,
        Query(ge=0, description="Records to skip")
    ] = 0
    limit: Annotated[
        int,
        Query(gt=0, le=100, description="Records to fetch")
    ] = 10
    department: Annotated[
        str | None,
        Query(default=None, min_length=1, max_length=50,
              description="Filter by department")
    ] = None
    salary: Annotated[
        int | float | None,
        Query(default=None, ge=0, description="Minimum salary threshold")
    ] = None
