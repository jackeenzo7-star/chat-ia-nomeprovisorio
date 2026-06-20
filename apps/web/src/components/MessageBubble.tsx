interface Message {
  id: string;
  text: string;
  fromUser: boolean;
}

const MessageBubble: React.FC<Message> = ({ text, fromUser }) => {
  const align = fromUser ? "justify-end" : "justify-start";
  const bg = fromUser
    ? "bg-[#DCF8C6] text-gray-900"
    : "bg-white text-gray-900";

  return (
    <div className={`flex ${align} my-1`}>
      <div className={`max-w-xs rounded-2xl p-2 shadow-sm ${bg}`}>
        <p className="break-words">{text}</p>
      </div>
    </div>
  );
};

export default MessageBubble;
