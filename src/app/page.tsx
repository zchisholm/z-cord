import { useState } from "react";

interface Message {
  sender: string;
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "Alice", content: "Hello, world!" },
    { sender: "Bob", content: "Hi, Alice!" },
  ]);
  const [input, setInput] = useState("");

  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>
          <strong>{message.sender}</strong>: {message.content}
        </div>
      ))}
      <form>
        <input type="text" name="message" id="message" />
      </form>
    </div>
  );
}
