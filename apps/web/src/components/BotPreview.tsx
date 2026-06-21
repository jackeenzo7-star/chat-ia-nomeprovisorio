import type { Bot } from "../types/bot";

interface Props {
  bot: Omit<Bot, "id" | "user_id" | "created_at" | "updated_at">;
}

const emoji: Record<string, string> = {
  neutro: "\u{1F9CD}",
  masculino: "\u{1F468}",
  feminino: "\u{1F469}",
};

export default function BotPreview({ bot }: Props) {
  return (
    <div className="bg-gray-50 border rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-4xl">{emoji[bot.gender] || "\u{1F9D0}"}</span>
        <div>
          <p className="font-bold text-lg text-gray-800">{bot.name || "Nome do Bot"}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {bot.tone && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-800 max-w-[200px] truncate" title={bot.tone}>
                {bot.tone.slice(0, 40)}{bot.tone.length > 40 ? "..." : ""}
              </span>
            )}
            {bot.language_style && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 max-w-[200px] truncate" title={bot.language_style}>
                {bot.language_style.slice(0, 40)}{bot.language_style.length > 40 ? "..." : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {bot.backstory && (
        <div>
          <p className="text-xs text-gray-400 uppercase font-semibold">História</p>
          <p className="text-sm text-gray-600 mt-0.5">{bot.backstory}</p>
        </div>
      )}

      <div className="flex justify-end">
        <div className="bg-white border rounded-2xl rounded-br-sm p-3 max-w-xs shadow-sm">
          <p className="text-sm text-gray-700">{bot.initial_greeting}</p>
        </div>
      </div>
    </div>
  );
}
