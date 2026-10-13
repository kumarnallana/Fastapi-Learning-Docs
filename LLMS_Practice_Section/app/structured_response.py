from google import genai
from dotenv import load_dotenv
from pydantic import BaseModel
import enum


load_dotenv()

# CREATING A BASE MODEL FOR STRUCTURED RESPONSE


class Receipe(BaseModel):
    receipe_name: str
    key_ingredients: str
    best_serve_wth: str
    rating: Grade


# CREATING A ENUM class
class Grade(enum.Enum):
    A_PLUS = 'a+'
    A = "a"
    B = "b"
    C = "c"


def structured_response():
    try:
        # CREATING A GOOGLE CLIENT
        client = genai.Client()

        # getting user name through user input
        user_name = input("Please enter you name to continue: ")

        user_input = input(
            f"{user_name},What's on you'r mind today?: ").strip()

        while user_input.lower() != "endchat".lower():
            # GETTING RESPONSE FROM THE MODEL
            model_response = client.models.generate_content(
                model="gemini-flash-lite-latest",
                contents=user_input,
                config={
                    "response_schema": list[Receipe],
                    "response_mime_type": "application/json"
                }
            )

            print(model_response.text)

            user_input = input(f"{user_name} (or enter 'endchat' to quit)")

        if user_input == "endchat":
            print(f"glad to meet you {user_name} have a nice day!!")

        print("Chat conversation ended!!")

    except Exception as error:
        print(f"Error: {error}\n")


if __name__ == "__main__":
    structured_response()
