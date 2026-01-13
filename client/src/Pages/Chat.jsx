import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

// connect to backend socket server
const socket = io("http://localhost:5000", {
      auth: {
      token: localStorage.getItem("token"),
      },
});

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // listen for incoming messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  // send message
  const sendMessage = () => {
    if (message.trim() === "") return;

    // yaha automation lagana hoga !!! NOTE IT !!! 

    socket.emit("send_message", {
      receiver: crime.user,        // 👈 USER WHO REPORTED THE CRIME
      crimeId: crime._id,          // 👈 CRIME ID
      text: message,
    });


    setMessages((prev) => [
      ...prev,
      { text: message, sender: "You" },
    ]);

    setMessage("");
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Chat</h2>

      {/* Messages */}
      <div className="flex-1 border p-3 overflow-y-auto mb-3">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <b>{msg.sender}:</b> {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          className="border flex-1 p-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
