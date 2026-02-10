import { ask } from "../services/ai.svc.js";

const chat = async (req, res) => {
    try {
        const { msg } = req.body;

        if (!msg) {
            return res.status(400).json({ reply: "Message missing." });
        }

        const ans = await ask(msg);
        res.json({ reply: ans });
    } catch (e) {
        console.error(e);
        res.status(500).json({ reply: "Bot failed to respond." });
    }
};

export { chat };
