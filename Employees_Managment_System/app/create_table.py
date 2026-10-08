from database.database import engine, Base
from models.department_models import DepartmentsBase
from models.employee import EmployeeBase


def reset_and_crete_db():

    # RESET EXISTING DATABASE
    Base.metadata.drop_all(bind=engine)
    print(f"Old Database records and table deleted Successfully..")

    # CREATING TABLE
    Base.metadata.create_all(bind=engine)

    print(
        f"Created a Relationship b/w {EmployeeBase.__tablename__} and {DepartmentsBase.__tablename__}With foreign key ")


if __name__ == "__main__":
    reset_and_crete_db()
