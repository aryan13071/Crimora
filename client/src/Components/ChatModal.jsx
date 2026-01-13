import { useEffect, useState } from "react";
import socket from "../utils/socket";

const ChatModal = ({ crime, user, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.emit("join_room", crime._id);

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receive_message");
  }, [crime._id]);

  const send = () => {
    socket.emit("send_message", {
      crimeId: crime._id,
      receiver: crime.user._id,
      text,
    });
    setText("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex">
      <div className="bg-white p-4 w-96">
        <h2>Chat with {crime.user.email}</h2>

        <div className="h-64 overflow-y-auto">
          {messages.map((m, i) => (
            <p key={i}>
              <b>{m.sender.email}</b>: {m.text}
            </p>
          ))}
        </div>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border w-full"
        />

        <button onClick={send}>Send</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ChatModal;
