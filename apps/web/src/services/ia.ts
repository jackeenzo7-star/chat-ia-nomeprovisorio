export const askIA = async (
  userMessage: string,
  characterPrompt?: string
) => {
  const res = await fetch("/api/chat", {
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
