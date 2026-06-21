import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BotPreview from "../components/BotPreview";

const bot = {
  name: "TestBot",
  gender: "masculino",
  backstory: "Veio do futuro.",
  language_style: "paciente e didático",
  tone: "bem-humorado e leve",
  initial_greeting: "E aí!",
};

describe("BotPreview", () => {
  it("exibe o nome do bot", () => {
    render(<BotPreview bot={bot} />);
    expect(screen.getByText("TestBot")).toBeTruthy();
  });

  it("exibe a história", () => {
    render(<BotPreview bot={bot} />);
    expect(screen.getByText("Veio do futuro.")).toBeTruthy();
  });

  it("exibe o tom como texto livre", () => {
    render(<BotPreview bot={bot} />);
    expect(screen.getByText("bem-humorado e leve")).toBeTruthy();
  });

  it("exibe a saudação em bolha de chat", () => {
    render(<BotPreview bot={bot} />);
    expect(screen.getByText("E aí!")).toBeTruthy();
  });

  it("exibe nome padrão quando vazio", () => {
    render(<BotPreview bot={{ ...bot, name: "" }} />);
    expect(screen.getByText("Nome do Bot")).toBeTruthy();
  });
});
