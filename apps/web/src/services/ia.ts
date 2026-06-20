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
  if (!res.ok) throw new Error("Erro ao chamar IA");
  return res.json();
};
