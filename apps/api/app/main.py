import logging
import os
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from .ai import ask_ai

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)


@app.before_request
def log_request():
    request._start_time = time.time()


@app.after_request
def log_response(response):
    elapsed = time.time() - request._start_time
    logger.info(
        "%s %s -> %s (%.3fs)",
        request.method,
        request.path,
        response.status_code,
        elapsed,
    )
    return response


@app.route("/ping")
def ping():
    return jsonify({"msg": "pong"})


@app.route("/health")
def health():
    groq_key = bool(os.getenv("GROQ_API_KEY"))
    return jsonify({
        "status": "ok",
        "groq_configured": groq_key,
    })


@app.errorhandler(500)
def handle_500(e):
    return jsonify({"error": "Erro interno do servidor"}), 500


@app.route("/chat", methods=["POST"])
def chat():
    body = request.get_json(silent=True)
    if not body or "user_message" not in body:
        return jsonify({"error": "Campo 'user_message' é obrigatório"}), 400
    user_message = body["user_message"]
    if not user_message or not user_message.strip():
        return jsonify({"error": "'user_message' não pode ser vazio"}), 400
    character_prompt = body.get(
        "character_prompt",
        "Você é um assistente amigável e prestativo. Responda de forma natural e concisa."
    )
    try:
        response = ask_ai(user_message, character_prompt)
    except Exception:
        return jsonify({"error": "Erro ao processar a mensagem"}), 500
    return jsonify({"response": response})
