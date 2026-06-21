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
    <div className="flex h-screen bg-gray-100">
      <aside className="w-full md:w-1/3 border-r border-gray-300 bg-white flex flex-col">
        <div className="p-4 text-lg font-semibold border-b flex justify-between items-center">
          <span>Bots</span>
          <span className="text-xs text-gray-400">{user}</span>
        </div>
        <div className="p-3 border-b">
          <button
            onClick={() => navigate("/bots/new")}
            className="w-full bg-[#075E54] text-white p-2 rounded-lg text-sm font-semibold hover:bg-[#054d44]"
          >
            + Novo Bot
          </button>
        </div>
        <ul className="divide-y flex-1 overflow-y-auto">
          {bots.map((bot) => (
            <li key={bot.id} className="hover:bg-gray-50 cursor-pointer">
              <Link to={`/chat/${bot.id}`} className="flex items-center p-4">
                <div className="w-10 h-10 rounded-full bg-green-600 mr-3 flex items-center justify-center text-white font-bold">
                  {bot.name[0]}
                </div>
                <div>
                  <p className="font-medium">{bot.name}</p>
                  <p className="text-sm text-gray-500 truncate">{bot.tone || "Sem tom definido"}</p>
                </div>
              </Link>
            </li>
          ))}
          {bots.length === 0 && (
            <li className="p-6 text-center text-gray-400 text-sm">
              Nenhum bot ainda. Crie um!
            </li>
          )}
        </ul>
      </aside>
      <main className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#ECE5DD] text-gray-500">
        <p className="text-lg">Selecione ou crie um bot para começar</p>
      </main>
    </div>
  );
}
