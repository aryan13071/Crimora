import { useState } from "react";

export default function ChatPopup({ close }) {
    const [msg, setMsg] = useState("");
    const [chat, setChat] = useState([
        { from: "bot", text: "Hi, I’m Crimora Assistant. How can I help you?" }
    ]);
    const [load, setLoad] = useState(false);

    const send = async () => {
        if (!msg.trim()) return;

        const userMsg = msg;
        setChat(c => [...c, { from: "user", text: userMsg }]);
        setMsg("");
        setLoad(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ msg: userMsg })
            });

            const data = await res.json();
            setChat(c => [...c, { from: "bot", text: data.reply }]);
        } catch {
            setChat(c => [...c, { from: "bot", text: "Something went wrong." }]);
        }

        setLoad(false);
    };

    return (
        <div className="fixed bottom-24 right-6 z-50
                        w-80 h-[420px]
                        bg-white rounded-xl shadow-xl
                        flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between
                            bg-black text-white px-4 py-3 rounded-t-xl">
                <span>🤖 Crimora Assistant</span>
                <button onClick={close} className="text-lg">✖</button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
                {chat.map((c, i) => (
                    <div
                        key={i}
                        className={`max-w-[75%] px-3 py-2 rounded-lg
                        ${c.from === "user"
                            ? "ml-auto bg-black text-white"
                            : "mr-auto bg-gray-200 text-black"
                        }`}
                    >
                        {c.text}
                    </div>
                ))}

                {load && (
                    <div className="mr-auto bg-gray-200 px-3 py-2 rounded-lg">
                        Typing...
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="flex border-t">
                <input
                    className="flex-1 px-3 py-2 outline-none text-sm"
                    placeholder="Ask something..."
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && send()}
                />
                <button
                    onClick={send}
                    className="px-4 bg-black text-white"
                >
                    ▶
                </button>
            </div>
        </div>
    );
}
