from fastapi import Query
from typing import Annotated
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


class EmployeeFilter(BaseModel):
    skip: int | None = None
    limit: Annotated[
        int | None,
        Query(
            default=10, gt=0, le=100, description="Fetching Number of results based on Query"
        )
    ] = 10
    department: Annotated[
        str | None,
        Query(min_length=3, max_length=20,
              description="Fetching based on the department")
    ] = "Engineering"
    salary: Annotated[
        int | None,
        Query(default=None, ge=200000, description="Filter Employee by Salary")
    ] = None


class EmployeeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    role: str
    experience: int
    department: str
