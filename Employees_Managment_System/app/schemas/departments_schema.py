from pydantic import BaseModel, ConfigDict, Field


class DepartmentCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100, description="Department name")


class DeparmentResponse(DepartmentCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


DepartmentResponse = DeparmentResponse
