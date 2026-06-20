import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBot } from "../services/bots";

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
      <div className="max-w-xl mx-auto bg-white rounded-lg p-6 shadow">
        <h1 className="text-2xl font-bold mb-4 text-[#075E54]">Criar Bot</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            placeholder="Nome *"
            value={form.name}
            onChange={set("name")}
            className="w-full p-3 border rounded-lg"
            required
          />

          <select value={form.gender} onChange={set("gender")} className="w-full p-3 border rounded-lg">
            <option value="neutro">Gênero: Neutro</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
          </select>

          <select value={form.language_style} onChange={set("language_style")} className="w-full p-3 border rounded-lg">
            <option value="informal">Estilo: Informal</option>
            <option value="formal">Estilo: Formal</option>
          </select>

          <select value={form.tone} onChange={set("tone")} className="w-full p-3 border rounded-lg">
            <option value="friendly">Tom: Amigável</option>
            <option value="serious">Tom: Sério</option>
            <option value="funny">Tom: Engraçado</option>
          </select>

          <textarea
            placeholder="História / background do bot"
            value={form.backstory}
            onChange={set("backstory")}
            className="w-full p-3 border rounded-lg"
            rows={3}
          />

          <input
            placeholder="Saudação inicial"
            value={form.initial_greeting}
            onChange={set("initial_greeting")}
            className="w-full p-3 border rounded-lg"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#075E54] text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Criar Bot"}
            </button>
            <button type="button" onClick={() => navigate("/")} className="border px-6 py-3 rounded-lg">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
