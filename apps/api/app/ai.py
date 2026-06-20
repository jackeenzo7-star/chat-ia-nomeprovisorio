import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def ask_ai(user_message: str, character_prompt: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": character_prompt},
            {"role": "user", "content": user_message},
        ],
        max_tokens=200,
        temperature=0.7,
    )
    return response.choices[0].message.content or ""
