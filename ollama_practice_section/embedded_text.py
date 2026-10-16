import ollama

documents = [
    "search_document: FastAPI is a modern Python web framework for building APIs.",
    "search_document: Next.js is a React framework for building full-stack web applications.",
    "search_query: What Python tool should I use for a web backend?"
]

ollama_response = ollama.embed(
    model="nomic-embed-text",
    input=documents
)

print(ollama_response["embeddings"][0])
# print(ollama_response[1])
# print(ollama_response[2])
