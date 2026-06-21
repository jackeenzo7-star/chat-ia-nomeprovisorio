import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatInput from "../components/ChatInput";

describe("ChatInput", () => {
  it("chama onSend ao clicar no botão enviar", () => {
    const onSend = jest.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByPlaceholderText("Digite uma mensagem...");
    fireEvent.change(input, { target: { value: "teste" } });

    const button = screen.getByRole("button", { name: "Enviar mensagem" });
    fireEvent.click(button);

    expect(onSend).toHaveBeenCalledWith("teste");
  });

  it("chama onSend ao pressionar Enter", () => {
    const onSend = jest.fn();
    render(<ChatInput onSend={onSend} />);

    const input = screen.getByPlaceholderText("Digite uma mensagem...");
    fireEvent.change(input, { target: { value: "enter msg" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onSend).toHaveBeenCalledWith("enter msg");
  });

  it("desabilita campos quando disabled=true", () => {
    render(<ChatInput onSend={jest.fn()} disabled={true} />);
    expect(screen.getByPlaceholderText("Selecione um bot...")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Enviar mensagem" })).toBeDisabled();
  });
});
