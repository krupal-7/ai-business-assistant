import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message, task } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Please enter a message."
      });
    }

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      instructions: `You are an AI Business Assistant.
The selected task is: ${task}.
Give a professional, useful and concise response.`,
      input: message
    });

    return res.status(200).json({
      reply: response.output_text
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "AI service is temporarily unavailable."
    });
  }
}
