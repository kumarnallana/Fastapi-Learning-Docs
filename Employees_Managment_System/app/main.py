from fastapi.responses import JSONResponse
import logging
from fastapi import Request, status
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from routers.employees import router as employee_router

from sqlalchemy.exc import OperationalError

app = FastAPI(
    title="Welcome to Fast api learning docs!"
)

logger = logging.getLogger(__name__)


@app.exception_handler(OperationalError)
def handle_db_timeout(request: Request, execution: OperationalError):
    logger.error(
        f"Database Connectivity is on {request.url.path}: {execution}")
    return JSONResponse(
        status_code=status.HTTP_505_HTTP_VERSION_NOT_SUPPORTED,
        content={
            "detail: Database connectivity is temporaly unavailable please try again later!"}
    )


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to FastAPI Learning Project API",
        "docs_url": "/docs",
    }


app.include_router(employee_router)
