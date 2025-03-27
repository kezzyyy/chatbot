import { json, type RequestHandler } from "@sveltejs/kit";
const ollama = (await import("ollama")).default;

const ollamaConfig = {
    model: "tinyllama",
    keep_alive: "5m",
    request_timeout: 120000, 
};

export const OPTIONS: RequestHandler = () => {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    });
};

export const POST: RequestHandler = async ({ request }) => {
    try {
        console.log("Received POST request");

        const body = await request.json();
        console.log("Full Request Body:", body);

        const message = body?.Chat;
        console.log("Extracted message:", message);

        if (!message) {
            console.error("No message received!");
            return json({ error: "No chat data provided" }, { status: 400 });
        }

        const user = {
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

        console.log("User data:", user);

        const response = await ollama.chat({
            ...ollamaConfig,
            messages: [
                {
                    role: "system",
                    content: `User's profile: ${JSON.stringify(user)}`,
                },
                {
                    role: "user",
                    content: message
                }
            ],
        });

        console.log("Ollama Response:", JSON.stringify(response, null, 2));

        if (!response || !response.message) {
            console.error("Invalid response from Ollama");
            return json({ error: "Invalid response from AI" }, { status: 500 });
        }

        return json({ message: response.message }, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        });

    } catch (error) {
        console.error("Backend error:", error);

        return json({
            error: "Backend error",
            details: error instanceof Error ? error.message : "Something went wrong."
        }, { status: 500 });
    }
};
