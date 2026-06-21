import { buildPrompt } from "../types/bot";
import type { Bot } from "../types/bot";

const base: Bot = {
  id: "1",
  user_id: "u1",
  name: "Teste",
  gender: "neutro",
  backstory: "",
  language_style: "informal",
  tone: "friendly",
  initial_greeting: "Oi!",
  created_at: "",
  updated_at: "",
};

describe("buildPrompt", () => {
  it("inclui o nome do bot", () => {
    expect(buildPrompt(base)).toContain("Você é Teste");
  });

  it("inclui o tom amigável", () => {
    expect(buildPrompt(base)).toContain("Tom: amigável");
  });

  it("inclui o tom sério", () => {
    expect(buildPrompt({ ...base, tone: "serious" })).toContain("Tom: sério");
  });

  it("inclui estilo formal quando language_style=formal", () => {
    expect(buildPrompt({ ...base, language_style: "formal" })).toContain("formal");
  });

  it("inclui backstory quando fornecida", () => {
    const r = buildPrompt({ ...base, backstory: "Nasci em Marte." });
    expect(r).toContain("História: Nasci em Marte.");
  });

  it("não inclui backstory vazia", () => {
    const r = buildPrompt(base);
    expect(r).not.toContain("História:");
  });
});
