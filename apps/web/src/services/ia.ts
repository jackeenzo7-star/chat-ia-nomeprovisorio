const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export const askIA = async (
  userMessage: string,
  characterPrompt?: string
) => {
  const url = BASE_URL ? `${BASE_URL}/chat` : "/api/chat";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_message: userMessage,
      character_prompt: characterPrompt,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Resposta do servidor:", res.status, text);
    throw new Error(`Erro ${res.status}: ${text}`);
  }
  return res.json();
};
