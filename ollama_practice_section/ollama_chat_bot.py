import ollama


class LocalChat:
    def __init__(self, model: str = "llama3.2"):
        self.model = model
        self.history = []

    def send_message(self, text: str) -> str:
        self.history.append({"role": "user", "content": text})
        response = ollama.chat(model=self.model, messages=self.history)
        reply = response["message"]["content"]
        self.history.append({"role": "assistant", "content": reply})
        return reply


if __name__ == "__main__":
    chat = LocalChat("llama3.2")
    print("Ollama Local Chatbot ready! (Type 'endchat' or 'exit' to quit)\n")

    while True:
        user_input = input("You: ").strip()

        if user_input.lower() in ("endchat", "exit", "quit"):
            print("\nSession ended. Goodbye! 👋")
            break

        if not user_input:
            continue

        response = chat.send_message(user_input)
        print(f"Ollama: {response}\n")
