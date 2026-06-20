import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MessageBubble from "../components/MessageBubble";
import ChatInput from "../components/ChatInput";
import { askIA } from "../services/ia";
import { listBots } from "../services/bots";
import { buildPrompt } from "../types/bot";
import type { Bot } from "../types/bot";
import type { Message } from "../types/chat";

export default function Chat() {
  const { id } = useParams();
  const [bot, setBot] = useState<Bot | null>(null);
  const [bots, setBots] = useState<Bot[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listBots().then((all) => {
      setBots(all);
      const found = all.find((b) => b.id === id);
      setBot(found || null);
      if (found) {
        setMessages([{ id: "0", text: `Olá! Sou ${found.name}. Como posso ajudar?`, fromUser: false }]);
      }
    });
  }, [id]);

  const handleSend = async (text: string) => {
    if (!bot) return;
    const userMsg: Message = { id: Date.now().toString(), text, fromUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await askIA(text, buildPrompt(bot));
      const iaMsg: Message = { id: (Date.now() + 1).toString(), text: data.response, fromUser: false };
      setMessages((prev) => [...prev, iaMsg]);
    } catch (e) {
      console.error("Erro completo:", e);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), text: "Erro ao conectar com a IA.", fromUser: false }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-1/3 border-r border-gray-300 bg-white flex flex-col">
        <div className="p-4 text-lg font-semibold border-b">Bots</div>
        <ul className="divide-y flex-1 overflow-y-auto">
          {bots.map((b) => (
            <li key={b.id} className={`hover:bg-gray-50 cursor-pointer ${b.id === id ? "bg-gray-100" : ""}`}>
              <Link to={`/chat/${b.id}`} className="flex items-center p-4">
                <div className="w-10 h-10 rounded-full bg-green-600 mr-3 flex items-center justify-center text-white font-bold">
                  {b.name[0]}
                </div>
                <div>
                  <p className="font-medium">{b.name}</p>
                  <p className="text-sm text-gray-500 truncate">{b.personality || ""}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="p-4 bg-[#075E54] text-white flex items-center gap-3">
          <Link to="/" className="text-white text-lg">&#8592;</Link>
          {bot && (
            <>
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                {bot.name[0]}
              </div>
              <div>
                <h1 className="text-lg font-semibold">{bot.name}</h1>
                <p className="text-xs text-green-200">{bot.relationship || "online"}</p>
              </div>
            </>
          )}
        </header>
        <section className="flex-1 overflow-y-auto p-4 bg-[#ECE5DD] space-y-1">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} {...msg} />
          ))}
          {loading && (
            <div className="flex justify-start my-1">
              <div className="bg-white rounded-2xl p-3 shadow-sm">
                <p className="text-gray-500 text-sm">digitando...</p>
              </div>
            </div>
          )}
        </section>
        <ChatInput onSend={handleSend} disabled={!bot} />
      </main>
    </div>
  );
}
