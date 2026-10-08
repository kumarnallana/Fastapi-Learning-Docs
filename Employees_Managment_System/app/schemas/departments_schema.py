from pydantic import BaseModel, ConfigDict, Field


class DepartmentCreate(BaseModel):
    name: str = Field(min_length=2)


class DeparmentResponse(DepartmentCreate):
    id: int
