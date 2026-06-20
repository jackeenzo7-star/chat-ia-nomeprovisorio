import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import MessageBubble from "../components/MessageBubble";
import ChatInput from "../components/ChatInput";
import { askIA } from "../services/ia";

interface Message {
  id: string;
  text: string;
  fromUser: boolean;
}

export default function Chat() {
  const { id } = useParams();
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Olá! Como você está?", fromUser: false },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      fromUser: true,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await askIA(text);
      const iaMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        fromUser: false,
      };
      setMessages((prev) => [...prev, iaMsg]);
    } catch (e) {
      console.error("Erro completo:", e);
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Erro ao conectar com a IA.",
        fromUser: false,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-1/3 border-r border-gray-300 bg-white">
        <div className="p-4 text-lg font-semibold border-b">Conversas</div>
        <ul className="divide-y">
          <li className="p-4 hover:bg-gray-50 cursor-pointer">
            <Link to="/chat/1" className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-600 mr-3" />
              <div>
                <p className="font-medium">Chat de teste</p>
                <p className="text-sm text-gray-500">Última mensagem...</p>
              </div>
            </Link>
          </li>
        </ul>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="p-4 bg-[#075E54] text-white flex items-center gap-3">
          <Link to="/" className="text-white text-lg">&#8592;</Link>
          <div className="w-10 h-10 rounded-full bg-gray-300" />
          <div>
            <h1 className="text-lg font-semibold">Chat {id}</h1>
            <p className="text-xs text-green-200">online</p>
          </div>
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
        <ChatInput onSend={handleSend} />
      </main>
    </div>
  );
}
