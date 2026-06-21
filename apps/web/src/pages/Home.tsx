import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listBots } from "../services/bots";
import { supabase } from "../lib/supabase";
import type { Bot } from "../types/bot";

export default function Home() {
  const navigate = useNavigate();
  const [bots, setBots] = useState<Bot[]>([]);
  const [user, setUser] = useState<string>("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user?.email || "");
    });
    listBots().then(setBots);
  }, []);

  return (
    <div className="flex h-screen bg-[#ECE5DD]">
      <aside className="w-full md:w-1/3 border-r border-gray-300 bg-white flex flex-col">
        <div className="p-4 bg-[#075E54] flex justify-between items-center">
          <span className="text-lg font-semibold text-white">Bots</span>
          <span className="text-xs text-green-200 truncate max-w-[120px]">{user}</span>
        </div>
        <div className="p-2 bg-gray-50">
          <button
            onClick={() => navigate("/bots/new")}
            className="w-full bg-[#075E54] text-white p-2 rounded-lg text-sm font-semibold hover:bg-[#054d44] transition-colors"
          >
            + Novo Bot
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto bg-white">
          {bots.map((bot) => (
            <li key={bot.id} className="hover:bg-gray-100 cursor-pointer transition-colors">
              <Link to={`/chat/${bot.id}`} className="flex items-center p-3.5 gap-3">
                <div className="w-12 h-12 rounded-full bg-[#075E54] flex items-center justify-center text-white font-bold text-lg shrink-0">
                  {bot.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-800 truncate">{bot.name}</p>
                  <p className="text-sm text-gray-500 truncate mt-0.5">{bot.tone || "Sem tom definido"}</p>
                </div>
              </Link>
            </li>
          ))}
          {bots.length === 0 && (
            <li className="p-8 text-center text-gray-400 text-sm">
              Nenhum bot ainda. Crie um!
            </li>
          )}
        </ul>
      </aside>
      <main className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#ECE5DD] text-gray-500">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 mx-auto mb-4 text-gray-300">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" />
            <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" />
          </svg>
          <p className="text-lg">Selecione ou crie um bot para começar</p>
        </div>
      </main>
    </div>
  );
}
