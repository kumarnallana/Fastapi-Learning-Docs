import httpx
from google import genai
from google.genai import types
from dotenv import load_dotenv

# load gemini_api_key from the .Environment
load_dotenv()


def fetch_docs():
    try:
        # creating a google client
        client = genai.Client()

        # creating config()
        doc_config = types.GenerateContentConfig(
            system_instruction="Provide me the summarized pdf within 100 words"
        )

        user_prompt = input("How you actually wanted to know about your pdf??")

        docs_url: str = "https://pdfplaceholder.com/pdf/Annual+Report+2026"

        fetched_docs = httpx.get(docs_url).content

        pdf_docs = types.Part.from_bytes(
            data=fetched_docs,
            mime_type="application/pdf"
        )

        system_response = client.models.generate_content(
            model="gemini-flash-lite-latest",
            contents=[pdf_docs, user_prompt],
            config=doc_config
        )

        print(system_response.text)

    except Exception as error:
        print(f"Error: {error}\n")


if __name__ == "__main__":
    fetch_docs()
