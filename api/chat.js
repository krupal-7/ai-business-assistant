import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
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
    const { message, task = "general" } = req.body || {};

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const instructions = `
You are BizAI, a professional AI Business Assistant.

The selected task is: ${task}

Follow the selected task EXACTLY.

If the task is "customer-reply":
Write a polite, professional customer-service response.
Do NOT write a product description.

If the task is "product-description":
Write a professional, attractive product description.
Include the product's important features, benefits, price if provided, and a clear call to action.
Do NOT write a customer-service reply.

If the task is "social-caption":
Write an engaging social-media caption suitable for Instagram/Facebook.
Include emojis only when appropriate and add relevant hashtags.

If the task is "faq":
Create clear frequently asked questions and answers for the business or product.

If the task is "general":
Act as a helpful business assistant.

Important:
- Follow the selected task.
- Do not change the task type.
- Do not add unnecessary greetings.
- Do not say "Hello, thank you for reaching out" unless the selected task is customer-reply.
- Be professional and concise.
`;

    const response = await client.responses.create({
      model: "gpt-5-mini",
      instructions: instructions,
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
