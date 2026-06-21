import { act, render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import BotCreate from "../pages/BotCreate";

jest.mock("../services/bots", () => ({
  createBot: jest.fn().mockResolvedValue({}),
  listBots: jest.fn().mockResolvedValue([
    { name: "assistente", id: "1", user_id: "u1", gender: "neutro", backstory: "c".repeat(10000), language_style: "b".repeat(5000), tone: "a".repeat(200), initial_greeting: "Oi", created_at: "", updated_at: "" },
  ]),
}));

const renderBotCreate = () => {
  render(
    <MemoryRouter>
      <BotCreate />
    </MemoryRouter>
  );
};

const btn = () => screen.getByRole("button", { name: "Criar Bot" });

describe("BotCreate", () => {
  it("renderiza o formulário", () => {
    renderBotCreate();
    expect(screen.getByRole("heading", { name: "Criar Bot" })).toBeTruthy();
  });

  it("mostra erro se nome estiver vazio ao submeter", async () => {
    renderBotCreate();
    fireEvent.click(btn());
    await waitFor(() => {
      expect(screen.getByText("O nome é obrigatório.")).toBeTruthy();
    });
  });

  it("mostra erro se nome for muito curto", async () => {
    renderBotCreate();
    const input = screen.getByPlaceholderText("Ex: Assistente Virtual");
    fireEvent.change(input, { target: { value: "A" } });
    fireEvent.click(btn());
    await waitFor(() => {
      expect(screen.getByText("O nome deve ter pelo menos 2 caracteres.")).toBeTruthy();
    });
  });

  it("mostra erro de nome duplicado", async () => {
    renderBotCreate();
    await act(async () => { await new Promise(r => setTimeout(r, 0)); });
    const input = screen.getByPlaceholderText("Ex: Assistente Virtual");
    fireEvent.change(input, { target: { value: "Assistente" } });
    fillLongFields();
    fireEvent.click(btn());
    await waitFor(() => {
      expect(screen.getByText("Já existe um bot com este nome.")).toBeTruthy();
    });
  });

  it("mostra erro se saudação estiver vazia", async () => {
    renderBotCreate();
    const input = screen.getByPlaceholderText("Ex: Assistente Virtual");
    const greeting = screen.getByPlaceholderText("Olá! Como posso ajudar?");
    fireEvent.change(input, { target: { value: "Bot Válido" } });
    fireEvent.change(greeting, { target: { value: "" } });
    fillLongFields();
    fireEvent.click(btn());
    await waitFor(() => {
      expect(screen.getByText("A saudação inicial é obrigatória.")).toBeTruthy();
    });
  });

  it("não mostra erros quando tudo está válido", async () => {
    renderBotCreate();
    const input = screen.getByPlaceholderText("Ex: Assistente Virtual");
    const greeting = screen.getByPlaceholderText("Olá! Como posso ajudar?");
    fireEvent.change(input, { target: { value: "NovoBot" } });
    fireEvent.change(greeting, { target: { value: "Oi!" } });
    fillLongFields();
    fireEvent.click(btn());
    await waitFor(() => {
      expect(screen.queryByText("O nome é obrigatório.")).toBeNull();
    });
  });

  function fillLongFields() {
    const tone = screen.getByPlaceholderText(/descreva como o bot deve se expressar/i);
    const style = screen.getByPlaceholderText(/descreva o estilo comportamental/i);
    const story = screen.getByPlaceholderText(/conte a história do bot/i);
    fireEvent.change(tone, { target: { value: "a".repeat(200) } });
    fireEvent.change(style, { target: { value: "b".repeat(5000) } });
    fireEvent.change(story, { target: { value: "c".repeat(10000) } });
  }
});
