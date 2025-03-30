import { json, type RequestHandler } from "@sveltejs/kit";
import { Ollama } from "ollama";

export const POST: RequestHandler = async ({ request }) => {
    const { query } = await request.json(); 

    const ollama = new Ollama({ host: "http://localhost:11434/" });

    const dataOfMasterUser = {
        name: "Red D. Molina",
        likes: ["Online Games", "Anime", "Beach", "Long Walk", "Cold weather", "Thunder Storm", "Dogs", "Cats"],
        hobbies: ["Outdoor Activities", "Listening to Music", "Online Games", "Watching Anime"],
        personal: ["22yrs old", "Lives in Mangan-Vaca Subic Zambales", "Birthday is at March 24, 2003"],
        education: [
            "Went to Subic Ecumenical Learning Center for Elementary",
            "For Highschool I went to Subic National High School (SPA)",
            "Currently in College at Gordon College"
        ],
        userType: "Master User",
    };

    const systemMessage = query.toLowerCase().includes("master user")
        ? `Here is the information of the master user: ${JSON.stringify(dataOfMasterUser)}`
        : "Respond only based on the information provided in the query.";

    const chat = await ollama.chat({
        model: "deepseek-r1:1.5b",
        messages: [
            {
                role: "system",
                content: systemMessage,
            },
            {
                role: "user",
                content: query,
            },
        ],
    });

    return json({ message: chat.message.content });
};