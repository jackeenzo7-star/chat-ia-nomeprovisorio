const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export interface MessageInput {
  role: "user" | "assistant";
  content: string;
}

export const askIA = async (
  userMessage: string,
  characterPrompt?: string,
  history?: MessageInput[]
) => {
  const url = BASE_URL ? `${BASE_URL}/chat` : "/api/chat";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_message: userMessage,
      character_prompt: characterPrompt,
      history,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Resposta do servidor:", res.status, text);
    throw new Error(`Erro ${res.status}: ${text}`);
  }
  return res.json();
};
