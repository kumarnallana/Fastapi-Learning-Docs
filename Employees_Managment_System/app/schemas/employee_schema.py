from fastapi import Query
from typing import Annotated
from datetime import date
from pydantic import BaseModel, ConfigDict, Field
from schemas.departments_schema import DeparmentResponse


class EmployeeBase(BaseModel):
    id: int
    name: str
    role: str
    experience: int
    salary: int | float
    department_id: int
    joining_date: date


class EmployeeCreate(EmployeeBase):
    password: str | int = Field(min_length=4,
                                description="Employee Raw password")


class EmployeeUpdate(BaseModel):
    name: str
    role: str
    experience: int
    salary: int | float
    department_id: int
    joining_date: date


class EmployeePartialUpdate(BaseModel):
    name: str | None = None
    role: str | None = None
    experience: int | None = None
    salary: int | float | None = None
    department_id: int | None = None
    joining_date: date | None = None


class EmployeeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    role: str
    experience: int
    salary: int | float
    joining_date: date
    department_id: int
    departments: DeparmentResponse | None = None


class Pagination(BaseModel):

    skip: Annotated[
        int,
        Query(ge=0, description="Records to skip")
    ] = 0

    limit: Annotated[
        int,
        Query(gt=0, le=100, description="Records to fetch")
    ] = 10


class EmployeeFilters(Pagination):
    department: Annotated[
        str | None,
        Query(default=None, min_length=1, max_length=50,
              description="Filter by department")
    ] = None
    salary: Annotated[
        int | float | None,
        Query(default=None, ge=0, description="Minimum salary threshold")
    ] = None
