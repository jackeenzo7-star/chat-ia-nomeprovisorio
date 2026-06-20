export interface Bot {
  id: string;
  user_id: string;
  name: string;
  gender: string;
  backstory: string;
  language_style: "formal" | "informal";
  tone: "friendly" | "serious" | "funny";
  initial_greeting: string;
  created_at: string;
  updated_at: string;
}

export function buildPrompt(bot: Bot): string {
  const toneDesc = {
    friendly: "amigável",
    serious: "sério",
    funny: "engraçado",
  };

  return [
    `Você é ${bot.name}.`,
    bot.gender ? `Gênero: ${bot.gender}.` : "",
    `Tom: ${toneDesc[bot.tone] || bot.tone}.`,
    `Estilo de linguagem: ${bot.language_style === "formal" ? "formal" : "informal"}.`,
    bot.backstory ? `História: ${bot.backstory}.` : "",
    "Responda de forma natural e concisa, como se estivesse conversando no WhatsApp.",
  ]
    .filter(Boolean)
    .join("\n");
}
