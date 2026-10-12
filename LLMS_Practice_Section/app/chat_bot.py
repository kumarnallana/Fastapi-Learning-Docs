from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()


def syora_chat_bot():
    try:
        client = genai.Client()
        chat_history = client.chats.create(model="gemini-flash-lite-latest")

        user_input: str = input(
            f"what's on your mind today? (note: type endchat to end the conversation)")

        while user_input.lower() != "endchat".lower():

            print(f"User: {user_input}")

            response = chat_history.send_message(user_input)

            print(f"Syora AI: {response.text}\n")

            user_input = input("You (or 'endchat')")

        print(f"You Session Has been ended...")

    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    syora_chat_bot()
