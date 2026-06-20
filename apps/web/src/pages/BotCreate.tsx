import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBot } from "../services/bots";

export default function BotCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    personality: "",
    gender: "",
    backstory: "",
    speaking_style: "",
    meeting_context: "",
    relationship: "",
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

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl mx-auto bg-white rounded-lg p-6 shadow">
        <h1 className="text-2xl font-bold mb-4 text-[#075E54]">Criar Bot</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input placeholder="Nome *" value={form.name} onChange={set("name")} className="w-full p-3 border rounded-lg" required />
          <input placeholder="Personalidade (ex: amigável, sarcástico)" value={form.personality} onChange={set("personality")} className="w-full p-3 border rounded-lg" />
          <input placeholder="Gênero" value={form.gender} onChange={set("gender")} className="w-full p-3 border rounded-lg" />
          <textarea placeholder="História / background" value={form.backstory} onChange={set("backstory")} className="w-full p-3 border rounded-lg" rows={3} />
          <input placeholder="Estilo de fala (ex: formal, informal)" value={form.speaking_style} onChange={set("speaking_style")} className="w-full p-3 border rounded-lg" />
          <input placeholder="Como conheceu o usuário" value={form.meeting_context} onChange={set("meeting_context")} className="w-full p-3 border rounded-lg" />
          <input placeholder="Relação (ex: amigo, mentor)" value={form.relationship} onChange={set("relationship")} className="w-full p-3 border rounded-lg" />
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="bg-[#075E54] text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50">
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
