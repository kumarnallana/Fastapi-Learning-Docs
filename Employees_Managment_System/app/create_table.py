from database.database import engine, Base
from models.employee import EmployeeBase

# CREATING TABLE
Base.metadata.create_all(bind=engine)

print(f"{EmployeeBase.__tablename__} Created Successfully")
