export interface Bot {
  id: string;
  user_id: string;
  name: string;
  gender: string;
  backstory: string;
  language_style: string;
  tone: string;
  initial_greeting: string;
  created_at: string;
  updated_at: string;
}

export function buildPrompt(bot: Bot): string {
  return [
    `Você é ${bot.name}.`,
    bot.gender ? `Gênero: ${bot.gender}.` : "",
    bot.tone ? `Tom: ${bot.tone}.` : "",
    bot.language_style ? `Estilo de linguagem: ${bot.language_style}.` : "",
    bot.backstory ? `História: ${bot.backstory}.` : "",
    "Responda de forma natural e concisa, como se estivesse conversando no WhatsApp.",
  ]
    .filter(Boolean)
    .join("\n");
}
