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
    <div className="flex items-end gap-2 p-2 bg-[#F0F0F0] border-t border-gray-200">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? "Selecione um bot..." : "Digite uma mensagem..."}
        disabled={disabled}
        rows={1}
        className="flex-1 max-h-24 p-3 bg-white border-0 rounded-2xl outline-none resize-none shadow-sm disabled:bg-gray-100 placeholder:text-gray-400 text-[14px]"
        style={{ lineHeight: "1.4" }}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        className="flex items-center justify-center w-11 h-11 rounded-full bg-[#075E54] text-white hover:bg-[#054d44] disabled:opacity-40 transition-colors shrink-0"
        aria-label="Enviar mensagem"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </div>
  );
};

export default ChatInput;
