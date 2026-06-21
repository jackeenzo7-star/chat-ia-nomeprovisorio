import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBot, listBots } from "../services/bots";
import BotPreview from "../components/BotPreview";
import type { Bot } from "../types/bot";

const LIMITS = {
  TONE: { MIN: 50, MAX: 200 },
  STYLE: { MIN: 2000, MAX: 5000 },
  STORY: { MIN: 1000, MAX: 10000 },
} as const;

const tip = (text: string) => ({ title: text });

function validate(form: typeof defaultForm, existingNames: string[]): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!form.name.trim()) errors.name = "O nome é obrigatório.";
  else if (form.name.trim().length < 2) errors.name = "O nome deve ter pelo menos 2 caracteres.";
  else if (existingNames.includes(form.name.trim().toLowerCase())) errors.name = "Já existe um bot com este nome.";
  if (!form.initial_greeting.trim()) errors.initial_greeting = "A saudação inicial é obrigatória.";
  const toneLen = form.tone.trim().length;
  if (toneLen < LIMITS.TONE.MIN) errors.tone = `O tom deve ter pelo menos ${LIMITS.TONE.MIN} caracteres (${toneLen}/${LIMITS.TONE.MIN}).`;
  else if (toneLen > LIMITS.TONE.MAX) errors.tone = `O tom deve ter no máximo ${LIMITS.TONE.MAX} caracteres (${toneLen}/${LIMITS.TONE.MAX}).`;
  const styleLen = form.language_style.trim().length;
  if (styleLen < LIMITS.STYLE.MIN) errors.language_style = `O estilo deve ter pelo menos ${LIMITS.STYLE.MIN} caracteres (${styleLen}/${LIMITS.STYLE.MIN}).`;
  else if (styleLen > LIMITS.STYLE.MAX) errors.language_style = `O estilo deve ter no máximo ${LIMITS.STYLE.MAX} caracteres (${styleLen}/${LIMITS.STYLE.MAX}).`;
  const storyLen = form.backstory.trim().length;
  if (storyLen < LIMITS.STORY.MIN) errors.backstory = `A história deve ter pelo menos ${LIMITS.STORY.MIN} caracteres (${storyLen}/${LIMITS.STORY.MIN}).`;
  else if (storyLen > LIMITS.STORY.MAX) errors.backstory = `A história deve ter no máximo ${LIMITS.STORY.MAX} caracteres (${storyLen}/${LIMITS.STORY.MAX}).`;
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
    <div className="min-h-screen bg-[#ECE5DD] p-3 md:p-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-1">
            <button onClick={() => navigate("/")} className="md:hidden text-gray-600 p-1" aria-label="Voltar">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Criar Bot</h1>
              <p className="text-xs md:text-sm text-gray-500">Defina a personalidade do seu assistente</p>
            </div>
          </div>

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg mb-4 text-sm font-medium" role="alert">
              Bot criado com sucesso! Redirecionando...
            </div>
          )}

          {!success && <form onSubmit={handleSubmit} className="space-y-4 mt-4" noValidate>
            <div>
              <label className="block text-xs text-gray-400 uppercase font-semibold mb-1" htmlFor="name" {...tip("Nome do bot")}>Nome *</label>
              <input
                id="name"
                placeholder="Ex: Assistente Virtual"
                value={form.name}
                onChange={set("name")}
                className={inputClass("name")}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && <p id="name-error" className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase font-semibold mb-1" htmlFor="gender" {...tip("Gênero percebido do bot")}>Gênero</label>
              <select id="gender" value={form.gender} onChange={set("gender")} className={inputClass("gender")}>
                <option value="neutro">Neutro</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase font-semibold mb-1 flex justify-between" htmlFor="tone" {...tip("Tom da comunicação do bot")}>
                <span>Tom {form.tone.trim().length >= LIMITS.TONE.MIN && form.tone.trim().length <= LIMITS.TONE.MAX ? "✅" : `(${form.tone.trim().length}/${LIMITS.TONE.MIN})`}</span>
                <span className={form.tone.trim().length >= LIMITS.TONE.MIN && form.tone.trim().length <= LIMITS.TONE.MAX ? "text-green-500" : "text-red-400"}>{LIMITS.TONE.MIN}-{LIMITS.TONE.MAX}</span>
              </label>
              <textarea
                id="tone"
                placeholder="Descreva como o bot deve se expressar (ex: caloroso, direto, poético...)"
                value={form.tone}
                onChange={set("tone")}
                className={inputClass("tone")}
                rows={4}
                maxLength={LIMITS.TONE.MAX}
                aria-invalid={!!errors.tone}
                aria-describedby={errors.tone ? "tone-error" : undefined}
              />
              {errors.tone && <p id="tone-error" className="text-red-500 text-xs mt-1">{errors.tone}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase font-semibold mb-1 flex justify-between" htmlFor="style" {...tip("Estilo de comportamento do bot")}>
                <span>Estilo {form.language_style.trim().length >= LIMITS.STYLE.MIN && form.language_style.trim().length <= LIMITS.STYLE.MAX ? "✅" : `(${form.language_style.trim().length}/${LIMITS.STYLE.MIN})`}</span>
                <span className={form.language_style.trim().length >= LIMITS.STYLE.MIN && form.language_style.trim().length <= LIMITS.STYLE.MAX ? "text-green-500" : "text-red-400"}>{LIMITS.STYLE.MIN}-{LIMITS.STYLE.MAX}</span>
              </label>
              <textarea
                id="style"
                placeholder="Descreva o estilo comportamental do bot (ex: paciente, didático, provocador...)"
                value={form.language_style}
                onChange={set("language_style")}
                className={inputClass("language_style")}
                rows={6}
                maxLength={LIMITS.STYLE.MAX}
                aria-invalid={!!errors.language_style}
                aria-describedby={errors.language_style ? "style-error" : undefined}
              />
              {errors.language_style && <p id="style-error" className="text-red-500 text-xs mt-1">{errors.language_style}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase font-semibold mb-1 flex justify-between" htmlFor="story" {...tip("História de fundo que define a personalidade do bot")}>
                <span>História {form.backstory.trim().length >= LIMITS.STORY.MIN && form.backstory.trim().length <= LIMITS.STORY.MAX ? "✅" : `(${form.backstory.trim().length}/${LIMITS.STORY.MIN})`}</span>
                <span className={form.backstory.trim().length >= LIMITS.STORY.MIN && form.backstory.trim().length <= LIMITS.STORY.MAX ? "text-green-500" : "text-red-400"}>{LIMITS.STORY.MIN}-{LIMITS.STORY.MAX}</span>
              </label>
              <textarea
                id="story"
                placeholder="Conte a história do bot: origem, experiências, personalidade..."
                value={form.backstory}
                onChange={set("backstory")}
                className={inputClass("backstory")}
                rows={8}
                maxLength={LIMITS.STORY.MAX}
                aria-invalid={!!errors.backstory}
                aria-describedby={errors.backstory ? "story-error" : undefined}
              />
              {errors.backstory && <p id="story-error" className="text-red-500 text-xs mt-1">{errors.backstory}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase font-semibold mb-1" htmlFor="greeting" {...tip("Mensagem que o bot envia ao iniciar uma conversa")}>Saudação inicial *</label>
              <input
                id="greeting"
                placeholder="Olá! Como posso ajudar?"
                value={form.initial_greeting}
                onChange={set("initial_greeting")}
                className={inputClass("initial_greeting")}
                aria-invalid={!!errors.initial_greeting}
                aria-describedby={errors.initial_greeting ? "greeting-error" : undefined}
              />
              {errors.initial_greeting && <p id="greeting-error" className="text-red-500 text-xs mt-1">{errors.initial_greeting}</p>}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 md:flex-none bg-[#075E54] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#054d44] disabled:opacity-40 transition-colors"
              >
                {saving ? "Salvando..." : "Criar Bot"}
              </button>
              <button type="button" onClick={() => navigate("/")} className="hidden md:inline-block border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
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
