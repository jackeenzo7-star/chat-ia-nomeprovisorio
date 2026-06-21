import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBot, listBots } from "../services/bots";
import BotPreview from "../components/BotPreview";
import type { Bot } from "../types/bot";

const MIN = { TONE: 200, STYLE: 5000, STORY: 10000 } as const;

const tip = (text: string) => ({ title: text });

function validate(form: typeof defaultForm, existingNames: string[]): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!form.name.trim()) errors.name = "O nome é obrigatório.";
  else if (form.name.trim().length < 2) errors.name = "O nome deve ter pelo menos 2 caracteres.";
  else if (existingNames.includes(form.name.trim().toLowerCase())) errors.name = "Já existe um bot com este nome.";
  if (!form.initial_greeting.trim()) errors.initial_greeting = "A saudação inicial é obrigatória.";
  if (form.tone.trim().length < MIN.TONE) errors.tone = `O tom deve ter pelo menos ${MIN.TONE} caracteres (${form.tone.trim().length}/${MIN.TONE}).`;
  if (form.language_style.trim().length < MIN.STYLE) errors.language_style = `O estilo deve ter pelo menos ${MIN.STYLE} caracteres (${form.language_style.trim().length}/${MIN.STYLE}).`;
  if (form.backstory.trim().length < MIN.STORY) errors.backstory = `A história deve ter pelo menos ${MIN.STORY} caracteres (${form.backstory.trim().length}/${MIN.STORY}).`;
  return errors;
}

const defaultForm = {
  name: "",
  gender: "neutro",
  backstory: "",
  language_style: "",
  tone: "",
  initial_greeting: "Olá! Como posso ajudar?",
};

export default function BotCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [existingNames, setExistingNames] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    listBots().then((bots) => setExistingNames(bots.map((b: Bot) => b.name.toLowerCase())));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form, existingNames);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSaving(true);
    try {
      await createBot(form);
      setSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar bot");
    } finally {
      setSaving(false);
    }
  };

  const set = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const inputClass = (field: string) =>
    `w-full p-3 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-[#075E54] focus:border-transparent ${
      errors[field] ? "border-red-400 bg-red-50" : "border-gray-300"
    }`;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold mb-1 text-gray-800">Criar Bot</h1>
          <p className="text-sm text-gray-500 mb-6">Defina a personalidade do seu assistente</p>

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
              Bot criado com sucesso! Redirecionando...
            </div>
          )}

          {!success && <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 uppercase font-semibold mb-1" {...tip("Nome do bot")}>Nome *</label>
              <input
                placeholder="Ex: Assistente Virtual"
                value={form.name}
                onChange={set("name")}
                className={inputClass("name")}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase font-semibold mb-1" {...tip("Gênero percebido do bot")}>Gênero</label>
              <select value={form.gender} onChange={set("gender")} className={inputClass("gender")}>
                <option value="neutro">Neutro</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase font-semibold mb-1 flex justify-between" {...tip("Tom da comunicação do bot")}>
                <span>Tom {form.tone.trim().length >= MIN.TONE ? "✅" : `(${form.tone.trim().length}/${MIN.TONE})`}</span>
                <span className={form.tone.trim().length >= MIN.TONE ? "text-green-500" : "text-red-400"}>{MIN.TONE} mín.</span>
              </label>
              <textarea
                placeholder="Descreva como o bot deve se expressar (ex: caloroso, direto, poético...)"
                value={form.tone}
                onChange={set("tone")}
                className={inputClass("tone")}
                rows={4}
              />
              {errors.tone && <p className="text-red-500 text-xs mt-1">{errors.tone}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase font-semibold mb-1 flex justify-between" {...tip("Estilo de comportamento do bot")}>
                <span>Estilo {form.language_style.trim().length >= MIN.STYLE ? "✅" : `(${form.language_style.trim().length}/${MIN.STYLE})`}</span>
                <span className={form.language_style.trim().length >= MIN.STYLE ? "text-green-500" : "text-red-400"}>{MIN.STYLE} mín.</span>
              </label>
              <textarea
                placeholder="Descreva o estilo comportamental do bot (ex: paciente, didático, provocador...)"
                value={form.language_style}
                onChange={set("language_style")}
                className={inputClass("language_style")}
                rows={6}
              />
              {errors.language_style && <p className="text-red-500 text-xs mt-1">{errors.language_style}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase font-semibold mb-1 flex justify-between" {...tip("História de fundo que define a personalidade do bot")}>
                <span>História {form.backstory.trim().length >= MIN.STORY ? "✅" : `(${form.backstory.trim().length}/${MIN.STORY})`}</span>
                <span className={form.backstory.trim().length >= MIN.STORY ? "text-green-500" : "text-red-400"}>{MIN.STORY} mín.</span>
              </label>
              <textarea
                placeholder="Conte a história do bot: origem, experiências, personalidade..."
                value={form.backstory}
                onChange={set("backstory")}
                className={inputClass("backstory")}
                rows={8}
              />
              {errors.backstory && <p className="text-red-500 text-xs mt-1">{errors.backstory}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase font-semibold mb-1" {...tip("Mensagem que o bot envia ao iniciar uma conversa")}>Saudação inicial *</label>
              <input
                placeholder="Olá! Como posso ajudar?"
                value={form.initial_greeting}
                onChange={set("initial_greeting")}
                className={inputClass("initial_greeting")}
              />
              {errors.initial_greeting && <p className="text-red-500 text-xs mt-1">{errors.initial_greeting}</p>}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#075E54] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#054d44] disabled:opacity-40 transition-colors"
              >
                {saving ? "Salvando..." : "Criar Bot"}
              </button>
              <button type="button" onClick={() => navigate("/")} className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
            </div>
          </form>}
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
