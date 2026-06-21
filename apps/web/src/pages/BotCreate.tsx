import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBot } from "../services/bots";
import BotPreview from "../components/BotPreview";

const tip = (text: string) => ({ title: text });

export default function BotCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    gender: "neutro",
    backstory: "",
    language_style: "informal" as const,
    tone: "friendly" as const,
    initial_greeting: "Olá! Como posso ajudar?",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await createBot(form);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar bot");
    } finally {
      setSaving(false);
    }
  };

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold mb-1 text-gray-800">Criar Bot</h1>
          <p className="text-sm text-gray-500 mb-6">Defina a personalidade do seu assistente</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 uppercase font-semibold mb-1" {...tip("Nome do bot")}>Nome *</label>
              <input
                placeholder="Ex: Assistente Virtual"
                value={form.name}
                onChange={set("name")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase font-semibold mb-1" {...tip("Gênero percebido do bot")}>Gênero</label>
              <select value={form.gender} onChange={set("gender")} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] outline-none">
                <option value="neutro">Neutro</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase font-semibold mb-1" {...tip("Tom emocional das respostas")}>Tom</label>
              <select value={form.tone} onChange={set("tone")} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] outline-none">
                <option value="friendly">Amigável</option>
                <option value="serious">Sério</option>
                <option value="funny">Engraçado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase font-semibold mb-1" {...tip("Nível de formalidade da linguagem")}>Estilo</label>
              <select value={form.language_style} onChange={set("language_style")} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] outline-none">
                <option value="informal">Informal</option>
                <option value="formal">Formal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase font-semibold mb-1" {...tip("História de fundo que define a personalidade do bot")}>História</label>
              <textarea
                placeholder="Ex: Nasci em uma cidade pequena e sempre gostei de ajudar pessoas..."
                value={form.backstory}
                onChange={set("backstory")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:border-transparent outline-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase font-semibold mb-1" {...tip("Mensagem que o bot envia ao iniciar uma conversa")}>Saudação inicial</label>
              <input
                placeholder="Olá! Como posso ajudar?"
                value={form.initial_greeting}
                onChange={set("initial_greeting")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#075E54] focus:border-transparent outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving || !form.name.trim()}
                className="bg-[#075E54] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#054d44] disabled:opacity-40 transition-colors"
              >
                {saving ? "Salvando..." : "Criar Bot"}
              </button>
              <button type="button" onClick={() => navigate("/")} className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
            </div>
          </form>
        </div>

        <div className="md:pt-16">
          <p className="text-xs text-gray-400 uppercase font-semibold mb-3">Pré-visualização</p>
          <div className="sticky top-4">
            <BotPreview bot={form} />
          </div>
        </div>
      </div>
    </div>
  );
}
