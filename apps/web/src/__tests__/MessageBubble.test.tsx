import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MessageBubble from "../components/MessageBubble";

describe("MessageBubble", () => {
  it("renderiza mensagem do usuário à direita", () => {
    const { container } = render(<MessageBubble id="1" text="Olá" fromUser={true} />);
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv.className).toContain("justify-end");
  });

  it("renderiza mensagem da IA à esquerda", () => {
    const { container } = render(<MessageBubble id="2" text="Oi!" fromUser={false} />);
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv.className).toContain("justify-start");
  });

  it("exibe o texto da mensagem", () => {
    render(<MessageBubble id="3" text="Teste" fromUser={true} />);
    expect(screen.getByText("Teste")).toBeTruthy();
  });
});
