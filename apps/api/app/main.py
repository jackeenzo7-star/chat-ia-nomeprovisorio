from flask import Flask, request, jsonify
from flask_cors import CORS
from .ai import ask_ai

app = Flask(__name__)
CORS(app)


@app.route("/ping")
def ping():
    return jsonify({"msg": "pong"})


@app.route("/chat", methods=["POST"])
def chat():
    body = request.get_json()
    user_message = body["user_message"]
    character_prompt = body.get(
        "character_prompt",
        "Você é um assistente amigável e prestativo. Responda de forma natural e concisa."
    )
    response = ask_ai(user_message, character_prompt)
    return jsonify({"response": response})
