import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";






// connect to backend socket server
const socket = io("http://localhost:5000", {
      auth: {
      token: localStorage.getItem("token"),
      },
});

console.log(`What is the Scoket : ->  ?? ${socket}`);



function Chat() {
  const { crimeId } = useParams();
  console.log(`Dekho Chat.jsx mai crime id yeh hui ${crimeId}`);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [crime, setCrime] = useState(null);

  useEffect(() => {
  if (!crimeId) return;

  socket.emit("join_room", crimeId);
  console.log("Joined room:", crimeId);

  return () => {
    socket.off("receive_message");
  };
}, [crimeId]);


  // useEffect(() => {
  //   if (!crime) return;

  //   socket.emit("join_room", crime._id);

  //   return () => {
  //     socket.emit("leave_room", crime._id);
  //   };
  // }, [crime]);


  useEffect(() => {
  fetch(`http://localhost:5000/api/crime/${crimeId}`)
  .then(res => {
    if (!res.ok) throw new Error("API failed");
    return res.json();
  })
  .then(data => setCrime(data))
  .catch(err => console.error(err));

  }, [crimeId]);

  console.log(`crime details of particular id is:`, crime);
  useEffect(() => {
  fetch(`/api/messages/${crimeId}`)
    .then(res => res.json())
    .then(setMessages);
  }, [crimeId]);



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

    if (!message.trim()) return;
    

    // yaha automation lagana hoga !!! NOTE IT !!! 

    socket.emit("send_message", {
      room: crime._id,
      text: message,
    });
    // return () => socket.emit("leave_room", crime._id);



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
