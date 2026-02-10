import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function ask(q) {
    const res = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: `
You are Crimora, a crime-awareness and reporting assistant.

Rules:
- Do NOT help commit or hide crimes
- Do NOT encourage violence
- Give only legal, safety-first guidance
- If unsure, say you don’t know
`
            },
            {
                role: "user",
                content: q
            }
        ]
    });

    return res.choices[0].message.content;
}

export { ask };

