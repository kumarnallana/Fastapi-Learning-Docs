
from datetime import date
from typing import Annotated, Any
from pydantic import BaseModel, Field, ConfigDict, field_validator, model_validator





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

    # -------------------------------------------------------------------------
    # 1. BEFORE VALIDATOR (Input Sanitization)
    # Why needed: Runs BEFORE Pydantic checks constraints like min_length.
    # Without this, a string of spaces "   " would pass min_length=1!
    # -------------------------------------------------------------------------
    @field_validator("name", "role", "department", mode="before")
    @classmethod
    def sanitize_strings(cls, value: Any) -> Any:
        if isinstance(value, str):
            value = value.strip()
            if not value:
                raise ValueError("Value cannot be blank or whitespace only")
        return value

    # -------------------------------------------------------------------------
    # 2. AFTER VALIDATOR (Dynamic Business Validation)
    # Why needed: Pydantic's Field(gt=...) can only compare static values.
    # It CANNOT compare dynamically against date.today() at runtime.
    # -------------------------------------------------------------------------
    @field_validator("joining_date", mode="after")
    @classmethod
    def validate_joining_date_not_future(cls, value: date) -> date:
        if value > date.today():
            raise ValueError("Joining date cannot be in the future")
        return value

    # -------------------------------------------------------------------------
    # 3. MODEL VALIDATOR (Cross-Field Validation)
    # Why needed: A field_validator only sees ONE field at a time.
    # A model_validator is required when one field depends on another
    # (here, verifying that Senior/Lead/Manager roles have sufficient experience).
    # -------------------------------------------------------------------------
    @model_validator(mode="after")
    def validate_senior_role_experience(self) -> "EmployeeBase":
        senior_keywords = ["senior", "lead", "manager"]
        if any(keyword in self.role.lower() for keyword in senior_keywords):
            if self.experience < 5:
                raise ValueError(
                    f"Roles containing 'Senior', 'Lead', or 'Manager' require at least 5 years of experience (provided: {self.experience} years for '{self.role}')."
                )
        return self


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

    # Before validator: strip string fields if provided
    @field_validator("name", "role", "department", mode="before")
    @classmethod
    def sanitize_partial_strings(cls, value: Any) -> Any:
        if isinstance(value, str):
            value = value.strip()
            if not value:
                raise ValueError("Value cannot be blank or whitespace only")
        return value

    # After validator: dynamic date check if provided
    @field_validator("joining_date", mode="after")
    @classmethod
    def validate_partial_joining_date(cls, value: date | None) -> date | None:
        if value is not None and value > date.today():
            raise ValueError("Joining date cannot be in the future")
        return value

    # After validator: salary check if provided
    @field_validator("salary", mode="after")
    @classmethod
    def validate_partial_salary(cls, value: int | float | None) -> int | float | None:
        if value is not None and value <= 200000:
            raise ValueError("Salary must be greater than 200,000")
        return value


class EmployeeResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    role: str
    experience: int
    department: str
