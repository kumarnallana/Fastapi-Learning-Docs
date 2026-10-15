import ollama


class LocalChat():
    def __init__(self, model: str):
        self.model = model
        self.history = []

    def send_message(self, text: str):
        self.history.append({
            "role": "user",
            "content": text
        })
        model_response = ollama.chat(
            model=self.model,
            messages=self.history
        )
        reply = model_response["messages"]["content"]

        self.history.append({
            "role": "Syora AI",
            "content": reply
        })

        return reply


if __name__ == "__main__":
    chat_bot = LocalChat("llama3.2")

    chat_end_commands = ["endchat", "quit", "exit"]

    while True:
        user_input = input(
            f"What's in your mind today? (enter {chat_end_commands} to stop conversation)").strip()

        if user_input.lower() in chat_end_commands:
            print("it's glad that i meet you see you soon..")
            break

        if not user_input:
            continue

        syora_response = chat_bot.send_message(user_input)
        print(f"Syora AI: {syora_response}")
