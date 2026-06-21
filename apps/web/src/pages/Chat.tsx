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
    <div className="flex h-screen bg-[#ECE5DD]">
      <aside className="hidden md:flex w-1/3 border-r border-gray-300 bg-white flex-col">
        <div className="p-4 bg-[#075E54] text-white font-semibold text-lg">Bots</div>
        <ul className="flex-1 overflow-y-auto bg-white">
          {bots.map((b) => (
            <li
              key={b.id}
              className={`hover:bg-gray-100 cursor-pointer transition-colors ${
                b.id === id ? "bg-gray-100" : ""
              }`}
            >
              <Link to={`/chat/${b.id}`} className="flex items-center p-3.5 gap-3">
                <div className="w-12 h-12 rounded-full bg-[#075E54] flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {b.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-800 truncate">{b.name}</p>
                  <p className="text-sm text-gray-500 truncate mt-0.5">
                    {b.tone || "Sem tom definido"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="p-3 bg-[#075E54] text-white flex items-center gap-3 shadow-sm">
          <Link to="/" className="text-white text-lg" aria-label="Voltar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </Link>
          {loadingBot && <p className="text-sm text-green-200">Carregando...</p>}
          {notFound && <p className="text-sm text-red-200">Bot não encontrado</p>}
          {bot && (
            <>
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white font-bold shrink-0">
                {bot.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base font-semibold truncate">{bot.name}</h1>
                <p className="text-xs text-green-200 truncate">
                  {bot.tone || "online"}
                </p>
              </div>
            </>
          )}
        </header>
        <section className="flex-1 overflow-y-auto bg-[#ECE5DD] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI5MCIgdmlld0JveD0iMCAwIDUwIDkwIj48cGF0aCBkPSJNMjUgNjBhMjUgMjUgMCAwMSAwIDUwIDI1IDI1IDAgMDIwIC01MHoiIGZpbGw9InJnYmEoMCwwLDAsMC4wMykiLz48L3N2Zz4=')] bg-repeat py-2">
          {notFound && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Bot não encontrado. Selecione outro bot.</p>
            </div>
          )}
          {!notFound && messages.map((msg) => (
            <MessageBubble key={msg.id} {...msg} />
          ))}
          {loading && (
            <div className="flex justify-start my-1 px-4">
              <div className="bg-white rounded-2xl rounded-bl-sm px-3 py-2 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </section>
        <ChatInput onSend={handleSend} disabled={!bot || notFound || loadingBot} />
      </main>
    </div>
  );
}
