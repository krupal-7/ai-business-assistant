export default async function handler(req, res) {
  // Allow your website to call this API
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": Bearer ${process.env.HF_TOKEN},
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "Qwen/Qwen2.5-7B-Instruct",
          messages: [
            {
              role: "system",
              content: "You are a helpful AI business assistant."
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 500
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Hugging Face error:", data);

      return res.status(response.status).json({
        error: data.error || "AI service error"
      });
    }

    const answer =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return res.status(200).json({
      reply: answer
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: "AI service is temporarily unavailable"
    });
  }
}
