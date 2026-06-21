import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MessageBubble from "../components/MessageBubble";
import ChatInput from "../components/ChatInput";
import { askIA } from "../services/ia";
import type { MessageInput } from "../services/ia";
import { getBot, listBots } from "../services/bots";
import { buildPrompt } from "../types/bot";
import type { Bot } from "../types/bot";
import type { Message } from "../types/chat";

export default function Chat() {
  const { id } = useParams();
  const [bot, setBot] = useState<Bot | null>(null);
  const [bots, setBots] = useState<Bot[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBot, setLoadingBot] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const msgId = useRef(0);

  useEffect(() => {
    if (!id) return;
    setLoadingBot(true);
    setNotFound(false);
    setMessages([]);
    setBot(null);
    getBot(id).then((found) => {
      setLoadingBot(false);
      if (!found) {
        setNotFound(true);
        return;
      }
      setBot(found);
      setMessages([
        { id: String(++msgId.current), text: found.initial_greeting, fromUser: false },
      ]);
    });
    listBots().then(setBots);
  }, [id]);

  const handleSend = async (text: string) => {
    if (!bot) return;
    const userMsg: Message = {
      id: String(++msgId.current),
      text,
      fromUser: true,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const history: MessageInput[] = messages
      .slice(-10)
      .map((m) => ({ role: m.fromUser ? "user" : "assistant", content: m.text }));

    try {
      const data = await askIA(text, buildPrompt(bot), history);
      const iaMsg: Message = {
        id: String(++msgId.current),
        text: data.response,
        fromUser: false,
      };
      setMessages((prev) => [...prev, iaMsg]);
    } catch (e) {
      console.error("Erro:", e);
      setMessages((prev) => [
        ...prev,
        {
          id: String(++msgId.current),
          text: "Erro ao conectar com a IA.",
          fromUser: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="hidden md:flex w-1/3 border-r border-gray-300 bg-white flex flex-col">
        <div className="p-4 text-lg font-semibold border-b">Bots</div>
        <ul className="divide-y flex-1 overflow-y-auto">
          {bots.map((b) => (
            <li
              key={b.id}
              className={`hover:bg-gray-50 cursor-pointer ${
                b.id === id ? "bg-gray-100" : ""
              }`}
            >
              <Link to={`/chat/${b.id}`} className="flex items-center p-4">
                <div className="w-10 h-10 rounded-full bg-green-600 mr-3 flex items-center justify-center text-white font-bold">
                  {b.name[0]}
                </div>
                <div>
                  <p className="font-medium">{b.name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {b.tone || "Sem tom definido"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="p-4 bg-[#075E54] text-white flex items-center gap-3">
          <Link to="/" className="text-white text-lg" aria-label="Voltar">
            &#8592;
          </Link>
          {loadingBot && <p className="text-sm text-green-200">Carregando...</p>}
          {notFound && <p className="text-sm text-red-200">Bot não encontrado</p>}
          {bot && (
            <>
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold shrink-0">
                {bot.name[0]}
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-semibold truncate">{bot.name}</h1>
                <p className="text-xs text-green-200">
                  {bot.tone || "Sem tom definido"}
                </p>
              </div>
            </>
          )}
        </header>
        <section className="flex-1 overflow-y-auto p-4 bg-[#ECE5DD] space-y-1">
          {notFound && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Bot não encontrado. Selecione outro bot.</p>
            </div>
          )}
          {!notFound && messages.map((msg) => (
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
        <ChatInput onSend={handleSend} disabled={!bot || notFound || loadingBot} />
      </main>
    </div>
  );
}
