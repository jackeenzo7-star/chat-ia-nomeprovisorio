import { useParams, Link } from "react-router-dom";

export default function Chat() {
  const { id } = useParams();

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-1/3 border-r border-gray-300 bg-white">
        <div className="p-4 text-lg font-semibold border-b">Conversas</div>
        <ul className="divide-y">
          <li className="p-4 hover:bg-gray-50 cursor-pointer">
            <Link to="/chat/1" className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-green-600 mr-3" />
              <div>
                <p className="font-medium">Chat de teste</p>
                <p className="text-sm text-gray-500">Última mensagem...</p>
              </div>
            </Link>
          </li>
        </ul>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="p-4 bg-[#075E54] text-white flex items-center gap-3">
          <Link to="/" className="text-white">&#8592;</Link>
          <div className="w-10 h-10 rounded-full bg-gray-300" />
          <div>
            <h1 className="text-lg font-semibold">Chat {id}</h1>
            <p className="text-xs text-green-200">online</p>
          </div>
        </header>
        <section className="flex-1 flex items-center justify-center text-gray-500 bg-[#ECE5DD]">
          <p>Mensagens aparecerão aqui</p>
        </section>
        <div className="p-4 bg-gray-200 border-t">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Digite uma mensagem..."
              className="flex-1 p-3 rounded-lg border outline-none"
            />
            <button className="bg-[#075E54] text-white px-6 py-3 rounded-lg">
              Enviar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
