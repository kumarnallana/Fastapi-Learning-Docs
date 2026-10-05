from database.database import Base
from models.employee import EmployeeBase
from sqlalchemy import select
from sqlalchemy.orm import Session


def get_all_emp_data(db: Session):

    # creating select query
    statement = select(EmployeeBase)
    # EXECUTING DB STATEMent
    exec_result = db.execute(statement)
    # convert the postgresql data rows into a list of sqlalchamey objects
    Employee_data = exec_result.scalars().all()

    return Employee_data
