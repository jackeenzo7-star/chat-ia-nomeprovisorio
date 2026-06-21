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
    mock_ask_ai.assert_called_once_with("Oi", "Você é um bot amigável.", [])


@patch("app.main.ask_ai")
def test_chat_with_history(mock_ask_ai):
    mock_ask_ai.return_value = "Legal!"

    with app.test_client() as client:
        response = client.post(
            "/chat",
            json={
                "user_message": "Tudo bem?",
                "character_prompt": "Seja amigável.",
                "history": [
                    {"role": "user", "content": "Oi"},
                    {"role": "assistant", "content": "Olá!"},
                ],
            },
        )

    assert response.status_code == 200
    mock_ask_ai.assert_called_once_with(
        "Tudo bem?", "Seja amigável.",
        [{"role": "user", "content": "Oi"}, {"role": "assistant", "content": "Olá!"}],
    )


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


def test_chat_missing_body():
    with app.test_client() as client:
        response = client.post("/chat", content_type="application/json", data="{}")

    assert response.status_code == 400
    assert response.get_json() == {"error": "Campo 'user_message' é obrigatório"}


def test_chat_no_json():
    with app.test_client() as client:
        response = client.post("/chat")

    assert response.status_code == 400
    assert response.get_json() == {"error": "Campo 'user_message' é obrigatório"}


@patch("app.main.ask_ai")
def test_chat_empty_message(mock_ask_ai):
    with app.test_client() as client:
        response = client.post("/chat", json={"user_message": ""})

    assert response.status_code == 400
    assert response.get_json() == {"error": "'user_message' não pode ser vazio"}
    mock_ask_ai.assert_not_called()


@patch("app.main.ask_ai")
def test_chat_ai_error(mock_ask_ai):
    mock_ask_ai.side_effect = Exception("API key inválida")

    with app.test_client() as client:
        response = client.post("/chat", json={"user_message": "Oi"})

    assert response.status_code == 500
    assert response.get_json() == {"error": "Erro ao processar a mensagem"}
