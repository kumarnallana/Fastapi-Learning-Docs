from pathlib import Path
import mimetypes
import httpx
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()


def get_document_part(source: str):
    """Loads a document (PDF, Word, Text) from a URL or local file into a Gemini Part."""
    source = source.strip()

    # 1. Fetch bytes from web or local file
    if source.startswith(("http://", "https://")):
        data = httpx.get(source, follow_redirects=True).content
    else:
        data = Path(source).read_bytes()

    # 2. Automatically detect MIME type (handles PDF, DOCX, TXT, etc.)
    mime_type, _ = mimetypes.guess_type(source)
    if not mime_type:
        mime_type = "application/pdf"

    # 3. Return modern multimodal Part
    return types.Part.from_bytes(data=data, mime_type=mime_type)


def fetch_docs():
    try:
        client = genai.Client()

        # Prompt user for document and query
        doc_source = input(
            "Enter Document URL or file path (PDF, Word, Text):\n> ").strip()
        user_prompt = input(
            "\nWhat would you like to know about this document?:\n> ").strip()

        # Convert to multimodal document part
        doc_part = get_document_part(doc_source)

        config = types.GenerateContentConfig(
            system_instruction="Analyze the provided document and answer the user question accurately and concisely."
        )

        print("\nAI Response:\n")

        # Stream response in real-time
        response = client.models.generate_content_stream(
            model="gemini-flash-lite-latest",
            contents=[doc_part, user_prompt],
            config=config,
        )

        for chunk in response:
            if chunk.text:
                print(chunk.text, end="", flush=True)

        print("\n")

    except Exception as error:
        print(f"\nError: {error}\n")


if __name__ == "__main__":
    fetch_docs()
