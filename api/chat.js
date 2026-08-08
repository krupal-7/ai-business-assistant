import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // Allow your GitHub Pages website to call this API
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://krupal-7.github.io"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message, task } = req.body || {};

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      instructions: `
You are an AI Business Assistant.

Help small businesses with:
- Customer replies
- Product descriptions
- Social media captions
- FAQs
- Marketing ideas
- Business writing

Be professional, useful, concise and easy to understand.

Task type: ${task || "general business assistance"}
      `,
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
