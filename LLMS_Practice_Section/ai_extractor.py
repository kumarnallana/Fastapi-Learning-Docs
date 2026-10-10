import os
from dotenv import load_dotenv
from pydantic import BaseModel
from google import genai
from google.genai import types

load_dotenv()

client = genai.Client()


class ExtractedEmployee(BaseModel):
    name: str
    role: str
    experience_years: int
    salary: float


messy_email = """
Hey team, excited to announce our new hire! 
Sasi Kumar Nallana is joining us next week. He has 3 years of hands-on 
experience building web apps and will be stepping into the AI Full Stack Engineer position. 
We agreed on a starting compensation of 120000.
"""

print("Sending messy text to the LLM...")

response = client.models.generate_content(
    model='gemini-3.8-flash',  # Updated to the active production model
    contents=messy_email,
    config=types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=ExtractedEmployee,
    ),
)

print("\n--- Extracted JSON Output ---")
print(response.text)
