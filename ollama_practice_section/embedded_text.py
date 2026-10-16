import ollama

# 1. Turn words into numbers
response = ollama.embed(model="nomic-embed-text", input="FastAPI backend")

# 2. Grab the list of numbers
vector = response["embeddings"][0]

print("Total numbers generated:", len(vector))
print("First 5 numbers:", vector[:5])
