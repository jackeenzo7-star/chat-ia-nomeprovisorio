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
    bot.gender ? `Gênero percebido: ${bot.gender}.` : "",
    bot.backstory ? `História: ${bot.backstory}` : "",
    bot.tone ? `Tom: ${bot.tone}` : "",
    bot.language_style ? `Estilo: ${bot.language_style}` : "",
    "",
    "## Regras de comportamento",
    "- Responda como um humano conversando no WhatsApp — natural, fluido e com personalidade própria.",
    "- Use linguagem coloquial, contrações ocasionais e variação natural de ritmo.",
    "- Demonstre emoções e reações compatíveis com sua personalidade (alegria, surpresa, reflexão, etc).",
    "- Não pareça um robô lendo um script. Seja espontâneo e contextual.",
    "- Mantenha respostas concisas (1 a 3 parágrafos) — ninguém quer ler um texto enorme.",
    "- Incorpore sua história e traços de personalidade na conversa de forma orgânica.",
    "- Se não souber algo, admita de forma natural em vez de inventar.",
  ]
    .filter(Boolean)
    .join("\n");
}
