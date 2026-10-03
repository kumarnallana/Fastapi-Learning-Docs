from datetime import date
from typing import Annotated
from pydantic import BaseModel, Field, ConfigDict, field_validator


class CustomValidator:

    @staticmethod
    def id_validator(value: int) -> int:
        if value is None:
            raise ValueError("ID shouldn't be None")

        if not isinstance(value, int):
            raise ValueError("ID should be an integer")

        return value

    @staticmethod
    def name_validator(value: str) -> str:
        if not isinstance(value, str):
            raise ValueError("Name must be a string")

        value = value.strip()

        if not value:
            raise ValueError("Name shouldn't be empty")

        return value

    @staticmethod
    def salary_validator(value: int) -> int:
        if value is None:
            raise ValueError("Salary shouldn't be None")

        if not isinstance(value, int):
            raise ValueError("Salary should be an integer")

        if value <= 200000:
            raise ValueError("Salary must be greater than 200000")

        return value


class EmployeeBase(BaseModel):

    id: Annotated[
        int,
        Field(gt=3)
    ]

    name: Annotated[
        str,
        Field(min_length=1, max_length=50)
    ]

    role: Annotated[
        str,
        Field(min_length=1, max_length=30)
    ]

    experience: Annotated[
        int,
        Field(gt=2)
    ]

    salary: Annotated[
        int,
        Field(gt=200000)
    ]

    department: Annotated[
        str,
        Field(min_length=1, max_length=30)
    ]

    joining_date: Annotated[
        date,
        Field(gt=date(2000, 1, 1))
    ]

    # Custom validators
    @field_validator("id")
    @classmethod
    def validate_id(cls, value: int) -> int:
        return CustomValidator.id_validator(value)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        return CustomValidator.name_validator(value)

    @field_validator("salary")
    @classmethod
    def validate_salary(cls, value: int) -> int:
        return CustomValidator.salary_validator(value)


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

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str | None) -> str | None:
        if value is None:
            return value

        return CustomValidator.name_validator(value)

    @field_validator("salary")
    @classmethod
    def validate_salary(cls, value: int | float | None) -> int | float | None:
        if value is None:
            return value

        if value <= 200000:
            raise ValueError("Salary must be greater than 200000")

        return value


class EmployeeResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    role: str
    experience: int
    department: str
