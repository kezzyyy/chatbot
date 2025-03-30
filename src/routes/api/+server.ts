import { json, type RequestHandler } from "@sveltejs/kit";
import { Ollama } from "ollama";

export const GET: RequestHandler = async () => {
    const ollama = new Ollama({ host: "http://localhost:11434/" });



    const chat = await ollama.chat({
        model: "deepseek-r1:1.5b",
        messages: [
            { role: "system", content: "you are clove from valorant. answer as clove. the assistant. only answer in english" },
            { role: "user", content: "Hello" },

        ],
    });

    return json({ done: chat.message.content });

}; 