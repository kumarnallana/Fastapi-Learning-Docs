from database.database import engine, Base
from models.employee import EmployeeBase


def reset_and_crete_db():

    # RESET EXISTING DATABASE
    Base.metadata.drop_all(bind=engine)
    print(f"Database records deleted Successfully..")

    # CREATING TABLE
    Base.metadata.create_all(bind=engine)

    print(f"{EmployeeBase.__tablename__} Created Successfully")


if __name__ == "__main__":
    reset_and_crete_db()
