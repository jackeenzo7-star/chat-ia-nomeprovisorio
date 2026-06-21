import { buildPrompt } from "../types/bot";
import type { Bot } from "../types/bot";

const base: Bot = {
  id: "1",
  user_id: "u1",
  name: "Teste",
  gender: "neutro",
  backstory: "",
  language_style: "calmo e paciente",
  tone: "amigável e acolhedor",
  initial_greeting: "Oi!",
  created_at: "",
  updated_at: "",
};

describe("buildPrompt", () => {
  it("inclui o nome do bot", () => {
    expect(buildPrompt(base)).toContain("Você é Teste");
  });

  it("inclui o tom como texto livre", () => {
    expect(buildPrompt(base)).toContain("Tom: amigável e acolhedor");
  });

  it("inclui o estilo como texto livre", () => {
    expect(buildPrompt({ ...base, language_style: "formal e direto" })).toContain("Estilo de linguagem: formal e direto");
  });

  it("inclui backstory quando fornecida", () => {
    const r = buildPrompt({ ...base, backstory: "Nasci em Marte." });
    expect(r).toContain("História: Nasci em Marte.");
  });

  it("não inclui backstory vazia", () => {
    const r = buildPrompt(base);
    expect(r).not.toContain("História:");
  });

  it("não inclui tom vazio", () => {
    const r = buildPrompt({ ...base, tone: "" });
    expect(r).not.toContain("Tom:");
  });

  it("não inclui estilo vazio", () => {
    const r = buildPrompt({ ...base, language_style: "" });
    expect(r).not.toContain("Estilo de linguagem:");
  });
});
