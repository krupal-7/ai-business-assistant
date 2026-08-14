const express = require("express");
const OpenAI = require("openai");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/chat", async (req, res) => {
    try {
        const { message, task } = req.body;

        if (!message) {
            return res.status(400).json({
                error: "Please enter a message."
            });
        }

        const response = await client.responses.create({
            model: "gpt-5-mini",
            instructions:
                `You are an AI Business Assistant.
                The user's selected task is: ${task}.
                Give a useful, professional and concise response.`,
            input: message
        });

        res.json({
            reply: response.output_text
        });

    } catch (error) {
        console.error("OpenAI Error:", error);

        res.status(500).json({
            error: "AI service is temporarily unavailable."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(AI Business Assistant running at http://localhost:${PORT});
}); 
