from pyexpat import model
from urllib.parse import uses_relative
from google import genai
from google.genai import types
from dotenv import load_dotenv

# LOADING GEMINI_API_KEY THROUGH DOTENV
load_dotenv()


def the_chat_bot():
    try:

        # CREATING GOOGLE CLIENT
        client = genai.Client()

        # GETTING USER NAME THORUGH INPUT
        user_name = input("Please Enter your name to proceed?")

        # CREATING USER_INPUT
        user_input = input(
            f"Hello {user_name.lower().strip()} you can start your conversation now, please feel free to type 'endchat' to stop the session!")

        # NOW WE ARE IMPLEMENTING THE DYNAMIC CHAT CONVERSATION WITHOUT ANY MANUALLY APPENDING
        chat_conversation = client.chats.create(
            model="gemini-flash-lite-latest")

        # BASED ON CONDITION WE WILL CONTINUE THE CHAT CONVERSATION
        while user_input.lower().strip() != 'endchat'.lower().strip():

            model_response = chat_conversation.send_message(user_input)

            print(f"Karen AI: {model_response.text}", end="\n")

            user_input = input(
                f"{user_name} (or you can type 'endchat' to quit)\n")

        print("previous session completed..")

    except Exception as error:
        print(f"Error occured: {error}", end="/n")


if __name__ == "__main__":
    the_chat_bot()
