from enum import StrEnum
from typing import cast
from pydantic import BaseModel, Field
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()


# 1. Define Enum FIRST with string inheritance for clean JSON serialization
class Grade(StrEnum):
    A_PLUS = "A+"
    A = "A"
    B = "B"
    C = "C"


# 2. Rich Pydantic model with Field descriptions to guide the LLM
class Recipe(BaseModel):
    name: str = Field(description="Name of the recipe or dish")
    ingredients: list[str] = Field(
        description="List of key ingredients required")
    best_served_with: str = Field(
        description="Recommended side dish or drink pairing")
    rating: Grade = Field(
        description="Overall difficulty or quality rating grade")


def structured_recipe_bot():
    try:
        client = genai.Client()

        # 3. Typed GenerateContentConfig with temperature tuning
        recipe_config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=list[Recipe],
            temperature=0.2,  # Low temperature guarantees strict schema adherence
            system_instruction="You are a professional chef. Provide recipes in structured format.",
        )

        user_name = input("Please enter your name: ").strip()
        print(
            f"\nWelcome {user_name}! Ask for any recipes (type 'endchat' to quit).\n")

        while True:
            user_input = input(f"{user_name}: ").strip()

            if user_input.lower() == "endchat":
                print(
                    f"\nGlad to meet you {user_name}, have a wonderful day! 👋\n")
                break

            if not user_input:
                continue

            # 4. Generate structured content
            response = client.models.generate_content(
                model="gemini-flash-lite-latest",
                contents=user_input,
                config=recipe_config,
            )

            # 5. Access the automatically validated Pydantic objects via response.parsed
            if not isinstance(response.parsed, list):
                print("Failed to extract recipes or empty response from model.\n")
                continue

            recipes = cast(list[Recipe], response.parsed)

            print("\n--- Extracted Recipes ---")
            for recipe in recipes:
                print(f"🍽️  {recipe.name} [Grade: {recipe.rating.value}]")
                print(f"   Ingredients: {', '.join(recipe.ingredients)}")
                print(f"   Best with:   {recipe.best_served_with}\n")

    except Exception as error:
        print(f"Error: {error}\n")


if __name__ == "__main__":
    structured_recipe_bot()
