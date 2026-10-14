from pathlib import Path
import mimetypes
import os
import httpx
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Look for .env in current and parent directories
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
load_dotenv()

# Extended MIME-type mappings for modern document formats
MIME_TYPE_MAP: dict[str, str] = {
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".doc": "application/msword",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".txt": "text/plain",
    ".md": "text/markdown",
    ".csv": "text/csv",
    ".html": "text/html",
    ".json": "application/json",
}


def load_document(source: str | Path) -> tuple[bytes, str, str]:
    """
    Universal document loader: supports local file paths and remote URLs.
    Returns (raw_bytes, mime_type, file_name).
    """
    source_str = str(source).strip()

    # 1. Handle Remote URL
    if source_str.startswith(("http://", "https://")):
        print(f"\n[Info] Fetching remote document: {source_str}")
        with httpx.Client(timeout=30.0, follow_redirects=True) as http_client:
            response = http_client.get(source_str)
            response.raise_for_status()
            data = response.content

        # Determine file name and MIME type from URL or HTTP headers
        url_path = source_str.split("?")[0]
        file_name = Path(url_path).name or "remote_document"
        header_mime = response.headers.get("content-type", "").split(";")[0].strip()

        # Fallback to extension if content-type is generic octet-stream
        suffix = Path(file_name).suffix.lower()
        mime_type = MIME_TYPE_MAP.get(suffix) or header_mime or "application/pdf"
        return data, mime_type, file_name

    # 2. Handle Local File Path
    file_path = Path(source_str).resolve()
    if not file_path.exists():
        raise FileNotFoundError(f"Local document not found at: {file_path}")

    print(f"\n[Info] Loading local document: {file_path.name}")
    data = file_path.read_bytes()
    suffix = file_path.suffix.lower()

    # Resolve MIME type
    mime_type = MIME_TYPE_MAP.get(suffix)
    if not mime_type:
        guessed, _ = mimetypes.guess_type(file_path)
        mime_type = guessed or "application/octet-stream"

    return data, mime_type, file_path.name


def analyze_document():
    """
    Main interactive workflow to load any document and analyze it using Gemini.
    """
    try:
        api_key = os.environ.get("GEMINI_API_KEY")
        client = genai.Client(api_key=api_key) if api_key else genai.Client()

        # Prompt user for document location (URL or local path)
        print("=" * 60)
        print("  Universal Document Analyzer (PDF, DOCX, TXT, CSV, MD)")
        print("=" * 60)
        source = input(
            "\nEnter document URL or local path (press Enter for default demo PDF):\n> "
        ).strip()

        # Default sample if user presses Enter
        if not source:
            source = "https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf"

        # Load bytes and MIME type dynamically
        data, mime_type, file_name = load_document(source)
        print(f"[Success] Loaded '{file_name}' ({len(data)} bytes, MIME: {mime_type})")

        # Convert raw bytes into a first-class multimodal Part
        doc_part = types.Part.from_bytes(data=data, mime_type=mime_type)

        # Get user's inquiry
        prompt = input(
            "\nWhat would you like to know or summarize about this document?\n> "
        ).strip()
        if not prompt:
            prompt = "Provide a comprehensive summary and key takeaways of this document."

        # Configure system instructions and parameters
        config = types.GenerateContentConfig(
            system_instruction=(
                "You are an expert document analysis assistant. Read the provided document carefully "
                "and answer questions accurately, citing specific sections, facts, or data points."
            ),
            temperature=0.2,
        )

        print("\n[AI] Analyzing document (streaming response)...\n")
        print("-" * 60)

        # Stream response token-by-token
        response_stream = client.models.generate_content_stream(
            model="gemini-flash-lite-latest",
            contents=[doc_part, prompt],
            config=config,
        )

        for chunk in response_stream:
            if chunk.text:
                print(chunk.text, end="", flush=True)

        print("\n" + "-" * 60)
        print("\n[Done] Analysis complete!\n")

    except Exception as error:
        print(f"\n[Error] {type(error).__name__}: {error}\n")


if __name__ == "__main__":
    analyze_document()
