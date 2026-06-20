from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .ai import ask_ai

app = FastAPI(
    title="Chat IA – Backend",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/ping")
async def ping():
    return {"msg": "pong"}


@app.post("/chat")
async def chat(request: Request):
    body = await request.json()
    user_message = body["user_message"]
    character_prompt = body.get(
        "character_prompt",
        "Você é um assistente amigável e prestativo. Responda de forma natural e concisa."
    )
    response = ask_ai(user_message, character_prompt)
    return {"response": response}
