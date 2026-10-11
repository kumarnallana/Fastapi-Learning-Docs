from pydantic import ConfigDict
from google import genai
from dotenv import load_dotenv
from google.genai import types
from PIL import Image
from pathlib import Path

# GETTING EXACT IMAGE PATH TO SOLVE THE FILE PATH ISSUE
BASE_DIR = Path(__file__).resolve().parent.parent
IMAGE_PATH = BASE_DIR / "demo_imgs" / "unknown.jpg"

load_dotenv()

# TAKING INPUT FROM THE USER
# user_prompt = input("Ask Something...")

# SETTING UP GOOGLE GEMINI CLIENT WHERE IT FETCHES GEMINI_API_KEY FROM THE .ENV FILE
client = genai.Client()

# BY USING PYTHON PILLOW LIBRARY TO EVALUATE A Image
image = Image.open(IMAGE_PATH)

print("Response loading feel free to work...")

# USING MODELS LIKE GEMINI FLASH - 8 OR OTHER MODELS TO FETCH AND VALIDATE DATA
response = client.models.generate_content(
    model="gemini-flash-lite-latest",
    # ANALYZING THE PROVIDED IMAGE THROUGH GEMINI AND GETTING RESULT ABOUT THE IMAGE
    contents=[
        image, "Please describe this image and who is the person in the image?"],
    # NOW USING GIVING INSTRUCTIONS TO THE GEMINI AI
    config=types.GenerateContentConfig(
        system_instruction="Provide me the response within 50 words, Express Well..",
        # MINIMIZING THE AI CREATIVITY CAPABILITY THROUGH TEMPERATURE
        temperature=0.0,
        # specifiying a json structure response which looks clean
        # response_mime_type="application/json"
    ),
)


print(response.text)
