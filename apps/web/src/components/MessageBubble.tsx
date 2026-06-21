interface Message {
  id: string;
  text: string;
  fromUser: boolean;
  timestamp?: string;
}

const MessageBubble: React.FC<Message> = ({ text, fromUser, timestamp }) => {
  const align = fromUser ? "justify-end" : "justify-start";
  const time = timestamp || new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`flex ${align} my-1 px-4`}>
      <div className={`relative max-w-xs ${fromUser ? "order-1" : "order-2"}`}>
        <div
          className={`
            px-3 py-2 shadow-sm break-words text-[14px] leading-[1.4]
            ${fromUser
              ? "bg-[#DCF8C6] text-gray-900 rounded-2xl rounded-br-sm"
              : "bg-white text-gray-900 rounded-2xl rounded-bl-sm"
            }
          `}
        >
          <p className="whitespace-pre-wrap">{text}</p>
        </div>
        <div className={`flex mt-0.5 ${fromUser ? "justify-end" : "justify-start"}`}>
          <span className="text-[11px] text-gray-400 select-none">{time}</span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;