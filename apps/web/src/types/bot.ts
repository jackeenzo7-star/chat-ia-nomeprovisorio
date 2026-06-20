export interface Bot {
  id: string;
  user_id: string;
  name: string;
  personality: string;
  gender: string;
  backstory: string;
  speaking_style: string;
  meeting_context: string;
  relationship: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export function buildPrompt(bot: Bot): string {
  return [
    `Você é ${bot.name}.`,
    bot.gender ? `Gênero: ${bot.gender}.` : "",
    bot.personality ? `Personalidade: ${bot.personality}.` : "",
    bot.speaking_style ? `Estilo de fala: ${bot.speaking_style}.` : "",
    bot.backstory ? `História: ${bot.backstory}.` : "",
    bot.meeting_context ? `Contexto de como conheceu o usuário: ${bot.meeting_context}.` : "",
    bot.relationship ? `Relação com o usuário: ${bot.relationship}.` : "",
    "Responda de forma natural e concisa, como se estivesse conversando no WhatsApp.",
  ]
    .filter(Boolean)
    .join("\n");
}
