import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex p-3 bg-gray-200 border-t border-gray-300 items-end gap-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? "Selecione um bot..." : "Digite uma mensagem..."}
        disabled={disabled}
        rows={1}
        className="flex-1 p-3 border border-gray-300 rounded-lg outline-none resize-none disabled:bg-gray-100"
      />
      <button
        onClick={handleSend}
        disabled={disabled}
        className="bg-[#075E54] text-white px-5 py-3 rounded-lg hover:bg-[#054d44] disabled:opacity-50"
      >
        Enviar
      </button>
    </div>
  );
};

export default ChatInput;
