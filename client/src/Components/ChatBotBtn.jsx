import { useState } from "react";
import ChatPopup from "./ChatPopup";

export default function ChatBotBtn() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Floating Button */}
            <div
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 z-50 cursor-pointer
                           bg-black text-white text-2xl
                           w-14 h-14 flex items-center justify-center
                           rounded-full shadow-lg hover:scale-105 transition"
            >
                💬
            </div>

            {open && <ChatPopup close={() => setOpen(false)} />}
        </>
    );
}
