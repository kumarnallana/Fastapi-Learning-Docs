from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()


def syora_chat_bot():
    try:
        client = genai.Client()

        user_input: str = input(
            f"what's on your mind today? (note: type endchat to end the conversation)")

        while user_input.lower() != "endchat".lower():

            print(f"User: {user_input}")

            agent_response = client.models.generate_content(
                model="gemini-3.5-flash",
                contents=user_input,
                config=types.GenerateContentConfig(
                    system_instruction="Reply with single consist of 20 characters"
                )
            )

            print(f"Syora AI: {agent_response.text}", end="\n")
            user_input = input("You(or 'endchat'): ")

        print(f"You Session Has been ended...")

    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    syora_chat_bot()
