import { getBot, listBots, createBot, updateBot, deleteBot } from "../services/bots";

const fakeBot = {
  id: "1",
  user_id: "u1",
  name: "Assistente",
  gender: "neutro",
  backstory: "",
  language_style: "informal" as const,
  tone: "friendly" as const,
  initial_greeting: "Olá!",
  created_at: "",
  updated_at: "",
};

let builder: ReturnType<typeof makeBuilder>;

function makeBuilder(data?: Record<string, unknown>) {
  const resolved = data || { data: null };
  const self = {
    then: (fn: (v: unknown) => unknown) => Promise.resolve(resolved).then(fn),
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    eq: jest.fn(),
    order: jest.fn(),
    single: jest.fn().mockResolvedValue(resolved),
  };
  self.select.mockReturnValue(self);
  self.insert.mockReturnValue(self);
  self.update.mockReturnValue(self);
  self.delete.mockReturnValue(self);
  self.eq.mockReturnValue(self);
  self.order.mockReturnValue(self);
  return self;
}

jest.mock("../lib/supabase", () => ({
  supabase: { from: jest.fn() },
}));

beforeEach(() => {
  builder = makeBuilder();
  const supabase = jest.requireMock("../lib/supabase").supabase;
  supabase.from.mockReturnValue(builder);
});

describe("getBot", () => {
  it("retorna o bot quando encontrado", async () => {
    builder.single.mockResolvedValue({ data: fakeBot });
    const result = await getBot("1");
    expect(result).toEqual(fakeBot);
    expect(builder.select).toHaveBeenCalledWith("*");
    expect(builder.eq).toHaveBeenCalledWith("id", "1");
    expect(builder.single).toHaveBeenCalled();
  });

  it("retorna null quando não encontrado", async () => {
    builder.single.mockResolvedValue({ data: null });
    const result = await getBot("inexistente");
    expect(result).toBeNull();
  });
});

describe("listBots", () => {
  it("retorna lista de bots", async () => {
    builder = makeBuilder({ data: [fakeBot] });
    const supabase = jest.requireMock("../lib/supabase").supabase;
    supabase.from.mockReturnValue(builder);
    const result = await listBots();
    expect(result).toEqual([fakeBot]);
  });

  it("retorna lista vazia", async () => {
    builder = makeBuilder({ data: null });
    const supabase = jest.requireMock("../lib/supabase").supabase;
    supabase.from.mockReturnValue(builder);
    const result = await listBots();
    expect(result).toEqual([]);
  });

  it("chama order com descending", async () => {
    builder = makeBuilder({ data: [fakeBot] });
    const supabase = jest.requireMock("../lib/supabase").supabase;
    supabase.from.mockReturnValue(builder);
    await listBots();
    expect(builder.order).toHaveBeenCalledWith("created_at", { ascending: false });
  });
});

describe("createBot", () => {
  it("cria e retorna o bot", async () => {
    builder.single.mockResolvedValue({ data: fakeBot, error: null });
    const result = await createBot(fakeBot);
    expect(result).toEqual(fakeBot);
  });

  it("lança erro quando falha", async () => {
    builder.single.mockResolvedValue({ data: null, error: new Error("Erro ao criar") });
    await expect(createBot(fakeBot)).rejects.toThrow("Erro ao criar");
    expect(builder.insert).toHaveBeenCalledWith(fakeBot);
  });
});

describe("updateBot", () => {
  it("atualiza e retorna o bot", async () => {
    builder.single.mockResolvedValue({ data: fakeBot, error: null });
    const result = await updateBot("1", { name: "Novo Nome" });
    expect(result).toEqual(fakeBot);
    expect(builder.update).toHaveBeenCalledWith({ name: "Novo Nome" });
  });

  it("lança erro quando falha", async () => {
    builder.single.mockResolvedValue({ data: null, error: new Error("Erro ao atualizar") });
    await expect(updateBot("1", { name: "Novo" })).rejects.toThrow("Erro ao atualizar");
  });
});

describe("deleteBot", () => {
  it("deleta sem erro", async () => {
    builder.eq.mockResolvedValue({ error: null });
    await expect(deleteBot("1")).resolves.toBeUndefined();
    expect(builder.delete).toHaveBeenCalled();
  });

  it("lança erro quando falha", async () => {
    builder.eq.mockResolvedValue({ error: new Error("Erro ao deletar") });
    await expect(deleteBot("1")).rejects.toThrow("Erro ao deletar");
  });
});
