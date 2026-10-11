from pathlib import Path
from PIL import Image
from dotenv import load_dotenv
from google import genai
from google.genai import types

# 1. Resolve path relative to this file (stepping up to LLMS_Practice_Section)
BASE_DIR = Path(__file__).resolve().parent.parent
IMAGE_PATH = BASE_DIR / "demo_imgs" / \
    "Chris-Evans-title-character-Joe-Johnston-Captain.webp"

load_dotenv()


def ai_response(image_path):
    try:
        client = genai.Client()
        image = Image.open(image_path)

        print("Response loading feel free to work...")

        # 2. Use active model with quota and stream tokens live
        response = client.models.generate_content_stream(
            model="gemini-flash-lite-latest",
            contents=[
                image, "Please describe this image and who is the person in the image?"],
            config=types.GenerateContentConfig(
                system_instruction="Provide me the response within 1000 words",
                temperature=0.2,
            ),
        )

        print("\n--- Live Streaming Output ---")
        for chunk in response:
            print(chunk.text, end="\n", flush=True)
        print("\n")

    except Exception as error:
        print(f"\n❌ Error Occurred: {error}")


if __name__ == "__main__":
    ai_response(IMAGE_PATH)
