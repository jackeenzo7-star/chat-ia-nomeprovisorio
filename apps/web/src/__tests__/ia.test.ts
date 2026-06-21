jest.mock("../services/ia", () => {
  let baseUrl = "";
  return {
    __esModule: true,
    setBaseUrl: (url: string) => { baseUrl = url; },
    askIA: jest.fn(
      async (userMessage: string, characterPrompt?: string, history?: unknown[]) => {
        const url = baseUrl ? `${baseUrl}/chat` : "/api/chat";
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_message: userMessage,
            character_prompt: characterPrompt,
            history,
          }),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Erro ${res.status}: ${text}`);
        }
        return res.json();
      },
    ),
  };
});

const { askIA, setBaseUrl } = jest.requireMock("../services/ia") as { askIA: typeof import("../services/ia").askIA; setBaseUrl: (url: string) => void };

function mockFetch(status: number, body: unknown) {
  globalThis.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(typeof body === "string" ? body : JSON.stringify(body)),
  });
}

beforeEach(() => {
  setBaseUrl("");
  jest.clearAllMocks();
});

describe("askIA", () => {
  it("usa /api/chat quando VITE_API_URL está vazio", async () => {
    setBaseUrl("");
    mockFetch(200, { response: "Olá!" });
    const result = await askIA("Oi");
    expect(result).toEqual({ response: "Olá!" });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/chat",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("usa VITE_API_URL como base quando configurado", async () => {
    setBaseUrl("https://api.example.com");
    mockFetch(200, { response: "Resposta" });
    const result = await askIA("teste", "prompt");
    expect(result).toEqual({ response: "Resposta" });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.example.com/chat",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("envia user_message, character_prompt e history no body", async () => {
    mockFetch(200, { response: "Resposta" });
    await askIA("Minha mensagem", "Meu prompt", [{ role: "assistant", content: "Oi" }]);
    const callArgs = (globalThis.fetch as jest.Mock).mock.calls[0];
    const body = JSON.parse(callArgs[1].body);
    expect(body).toEqual({
      user_message: "Minha mensagem",
      character_prompt: "Meu prompt",
      history: [{ role: "assistant", content: "Oi" }],
    });
  });

  it("envia sem character_prompt e history quando não fornecidos", async () => {
    mockFetch(200, { response: "Resposta" });
    await askIA("Oi");
    const callArgs = (globalThis.fetch as jest.Mock).mock.calls[0];
    const body = JSON.parse(callArgs[1].body);
    expect(body.character_prompt).toBeUndefined();
    expect(body.history).toBeUndefined();
  });

  it("lança erro quando servidor retorna erro", async () => {
    mockFetch(500, "Erro interno");
    await expect(askIA("Oi")).rejects.toThrow("Erro 500: Erro interno");
  });

  it("lança erro quando fetch falha (rede)", async () => {
    globalThis.fetch = jest.fn().mockRejectedValue(new Error("Network error"));
    await expect(askIA("Oi")).rejects.toThrow("Network error");
  });
});
