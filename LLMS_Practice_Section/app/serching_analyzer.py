from pydantic.deprecated import tools
from click import UsageError
from google import genai
from google.genai import types
from dotenv import load_dotenv


# LOADING THE ENV FILE TO GET GEMINI_API_KEY
load_dotenv()


def search_bot():
    try:

        client = genai.Client()

        # IMPLEMENTING GOOGLE SEARCH SO AI CAN KNOW ABOUT THE LATES INFORMATION
        grounding_tool = types.Tool(
            google_search=types.GoogleSearch()
        )

        # getting user name through input
        user_name = input("Please enter your name to continue: ")

        user_history = client.chats.create(
            model="gemini-flash-lite-latest",
            config=types.GenerateContentConfig(
                tools=[grounding_tool]
            )

        )

        # creating a user input
        user_input = input(
            f"{user_name} what's on your mind today?: ").strip()

        while user_input.lower() != "endchat".lower().strip():
            # CREATING A MULTI CHAT MODEL WITH MODERN APPROACH
            model_response = user_history.send_message(user_input)

            print(f"Syora AI: {model_response.text}\n")

            user_input = input(f"{user_name} or (type 'endchat' to quit!)")

        print(f"Glad to meet you {user_name} see you soon..\n")
        print("conversation ended thank you very much\n")

    except Exception as error:
        print(f"Error: {error}\n")


if __name__ == "__main__":
    search_bot()
