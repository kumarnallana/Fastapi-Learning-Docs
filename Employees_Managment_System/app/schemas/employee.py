from fastapi import HTTPException, status
from fastapi import Query
from typing import Annotated
from datetime import date
from pydantic import BaseModel, ConfigDict, model_validator, field_validator


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


class EmployeeFilters(BaseModel):

    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )

    skip: int | None = 0
    limit: Annotated[
        int | None,
        Query(
            default=10,
            ge=10,
            description="Fetching Employee by limit"
        )
    ] = 10
    department: Annotated[
        str | None,
        Query(
            min_length=1,
            max_length=50
        )
    ] = "Engineering"
    salary: Annotated[
        int | None,
        Query(
            default=None,
            ge=20000,
            description="Fetching Employee by salary"
        )
    ] = None

    @field_validator("department")
    @classmethod
    def department_validator(cls, data: str):

        allowed_departments: list[str] = [
            "Finance",
            "Infrastructure",
            "Data Science",
            "Product",
            "Design",
            "Human Resources"
            "Engineering"
        ]

        if data not in allowed_departments:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"{data} is not in employee database"
            )

        return data
