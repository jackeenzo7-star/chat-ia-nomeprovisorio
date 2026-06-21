import json
from unittest.mock import patch
from app.main import app


def test_ping():
    with app.test_client() as client:
        response = client.get("/ping")
        assert response.status_code == 200
        assert response.get_json() == {"msg": "pong"}


@patch("app.main.ask_ai")
def test_chat(mock_ask_ai):
    mock_ask_ai.return_value = "Olá! Como posso ajudar?"

    with app.test_client() as client:
        response = client.post(
            "/chat",
            json={
                "user_message": "Oi",
                "character_prompt": "Você é um bot amigável.",
            },
        )

    assert response.status_code == 200
    assert response.get_json() == {"response": "Olá! Como posso ajudar?"}
    mock_ask_ai.assert_called_once_with("Oi", "Você é um bot amigável.")


@patch("app.main.ask_ai")
def test_chat_default_prompt(mock_ask_ai):
    mock_ask_ai.return_value = "Resposta padrão."

    with app.test_client() as client:
        response = client.post("/chat", json={"user_message": "teste"})

    assert response.status_code == 200
    mock_ask_ai.assert_called_once()
    args, _ = mock_ask_ai.call_args
    assert args[0] == "teste"
    assert "assistente amigável" in args[1]
