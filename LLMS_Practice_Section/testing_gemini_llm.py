from dotenv import load_dotenv
from google import genai
from google.genai import types


load_dotenv()

user_prompt = input("Enter your what you want?")

client = genai.Client()

print("Getting response on the way feel free to relax.....")

model_response = client.models.generate_content(
    model="gemini-3.8-flash",
    contents=user_prompt,
    config=types.GenerateContentConfig(
        response_mime_type="application/json",
        system_instruction="Provide me the response within 20 words",
    ),

)

print("--------------------------------------")
print(model_response.text)
