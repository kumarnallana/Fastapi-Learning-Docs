from schemas.employee import EmployeeCreate, EmployeeResponse, EmployeeUpdate, EmployeePartialUpdate
from fastapi import HTTPException, status
from datetime import date


employees_create: list[EmployeeCreate] = [
    EmployeeCreate(
        id=101,
        name="Aarav Sharma",
        role="Software Engineer",
        experience=3,
        salary=275000,
        department="Engineering",
        joining_date=date(2023, 1, 10),
    ),
    EmployeeCreate(
        id=102,
        name="Priya Patel",
        role="HR Specialist",
        experience=4,
        salary=260000,
        department="Human Resources",
        joining_date=date(2022, 2, 15),
    ),
    EmployeeCreate(
        id=103,
        name="Rohan Verma",
        role="Senior Backend Developer",
        experience=6,
        salary=310000,
        department="Engineering",
        joining_date=date(2020, 3, 20),
    ),
    EmployeeCreate(
        id=104,
        name="Sneha Reddy",
        role="UI/UX Designer",
        experience=3,
        salary=245000,
        department="Design",
        joining_date=date(2023, 4, 5),
    ),
    EmployeeCreate(
        id=105,
        name="Vikram Malhotra",
        role="Product Manager",
        experience=7,
        salary=350000,
        department="Product",
        joining_date=date(2019, 5, 12),
    ),
    EmployeeCreate(
        id=106,
        name="Ananya Iyer",
        role="Data Scientist",
        experience=4,
        salary=290000,
        department="Data Science",
        joining_date=date(2022, 6, 18),
    ),
    EmployeeCreate(
        id=107,
        name="Karan Singh",
        role="DevOps Engineer",
        experience=5,
        salary=305000,
        department="Infrastructure",
        joining_date=date(2021, 7, 22),
    ),
    EmployeeCreate(
        id=108,
        name="Neha Gupta",
        role="Financial Analyst",
        experience=4,
        salary=255000,
        department="Finance",
        joining_date=date(2022, 8, 10),
    ),
    EmployeeCreate(
        id=109,
        name="Aditya Joshi",
        role="Frontend Developer",
        experience=3,
        salary=240000,
        department="Engineering",
        joining_date=date(2024, 1, 8),
    ),
    EmployeeCreate(
        id=110,
        name="Meera Nair",
        role="QA Engineer",
        experience=3,
        salary=250000,
        department="Quality Assurance",
        joining_date=date(2023, 2, 14),
    ),
    EmployeeCreate(
        id=111,
        name="Siddharth Rao",
        role="Marketing Specialist",
        experience=4,
        salary=265000,
        department="Marketing",
        joining_date=date(2022, 3, 11),
    ),
    EmployeeCreate(
        id=112,
        name="Pooja Das",
        role="Accountant",
        experience=5,
        salary=270000,
        department="Finance",
        joining_date=date(2021, 4, 19),
    ),
    EmployeeCreate(
        id=113,
        name="Rahul Deshmukh",
        role="Sales Executive",
        experience=3,
        salary=235000,
        department="Sales",
        joining_date=date(2023, 5, 7),
    ),
    EmployeeCreate(
        id=114,
        name="Divya Kapoor",
        role="HR Manager",
        experience=8,
        salary=320000,
        department="Human Resources",
        joining_date=date(2018, 6, 21),
    ),
    EmployeeCreate(
        id=115,
        name="Arjun Mehta",
        role="Cloud Architect",
        experience=9,
        salary=400000,
        department="Infrastructure",
        joining_date=date(2018, 7, 13),
    ),
    EmployeeCreate(
        id=116,
        name="Kavita Pillai",
        role="Content Strategist",
        experience=3,
        salary=240000,
        department="Marketing",
        joining_date=date(2023, 8, 9),
    ),
    EmployeeCreate(
        id=117,
        name="Manish Tiwari",
        role="Customer Support Lead",
        experience=5,
        salary=250000,
        department="Support",
        joining_date=date(2021, 9, 17),
    ),
    EmployeeCreate(
        id=118,
        name="Tanvi Saxena",
        role="Security Engineer",
        experience=4,
        salary=300000,
        department="Security",
        joining_date=date(2022, 10, 25),
    ),
    EmployeeCreate(
        id=119,
        name="Varun Nambiar",
        role="Business Analyst",
        experience=3,
        salary=275000,
        department="Product",
        joining_date=date(2023, 11, 6),
    ),
    EmployeeCreate(
        id=120,
        name="Ishaan Kulkarni",
        role="Mobile App Developer",
        experience=4,
        salary=285000,
        department="Engineering",
        joining_date=date(2022, 12, 12),
    ),
]


def get_all_employees_data():
    return employees_create


def get_employee_by_id(target_id: int) -> EmployeeResponse:
    for employee in employees_create:
        if employee.id == target_id:
            return employee

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={
            "field": f"id:{target_id}",
            "message": f"Employee Not found with id:{target_id}"
        }
    )


def create_new_employee(employee: EmployeeCreate) -> EmployeeCreate:
    for existing_emp in employees_create:
        if existing_emp.id == employee.id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "field": f"id: {employee.id}",
                    "message": f"Employee with id {employee.id} already exists"
                }
            )
    employees_create.append(employee)

    return employee


def update_employee_completeData(target_id: int, updated_data: EmployeeUpdate) -> EmployeeCreate:
    for index, employee in enumerate(employees_create):
        if employee.id == target_id:
            updated_data.id = target_id
            employees_create[index] = updated_data
            return employees_create[index]

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={
            "field": f"id:{target_id}",
            "message": f"Employee Not found with id:{target_id}"
        }
    )


def partially_update_empdata(target_id: int, update_data: EmployeePartialUpdate) -> EmployeeCreate:
    for index, employee in enumerate(employees_create):
        if employee.id == target_id:
            update_data = update_data.model_dump(exclude_unset=True)
            current_data = employee.model_dump()
            current_data.update(update_data)
            current_data["id"] = target_id
            partial_update = EmployeeCreate(**current_data)
            employees_create[index] = partial_update
            return partial_update

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={
            "field": f"id:{target_id}",
            "message": f"Employee Not found with id:{target_id}"
        }
    )


def delete_employee_by_id(target_id: int):
    for index, employee in enumerate(employees_create):
        if employee.id == target_id:
            employees_create.pop(index)
            return employee

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={
            "field": f"id:{target_id}",
            "message": f"Employee Not found with id:{target_id}"
        }
    )
