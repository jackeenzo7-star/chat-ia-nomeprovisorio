import { Link } from "react-router-dom";

export default function Home() {
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
        <header className="p-4 bg-[#075E54] text-white flex items-center">
          <h1 className="text-xl font-semibold">Selecione uma conversa</h1>
        </header>
        <section className="flex-1 flex items-center justify-center text-gray-500">
          <p>Escolha ou crie uma nova conversa</p>
        </section>
      </main>
    </div>
  );
}
