// AI Controller for Bolibazaar
// Uses OpenAI API (or mock if not configured)
import axios from "axios";

export const generateDescription = async (req, res) => {
  const { itemName, itemCategory } = req.body;
  if (!itemName || !itemCategory) {
    return res.status(400).json({ error: "Missing item name or category" });
  }

  // Use OpenAI if API key is set, else fallback to mock
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    // Mock response for local/dev
    return res.json({
      description: `Introducing the ${itemName} (${itemCategory}) — a must-have for collectors and enthusiasts! Bid now to own this unique item on Bolibazaar.`
    });
  }

  try {
    const prompt = `Write a catchy, engaging auction description for a(n) ${itemCategory} called "${itemName}". Mention why it's special and encourage bidding. Brand: Bolibazaar.`;
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful auction assistant." },
          { role: "user", content: prompt }
        ],
        max_tokens: 80,
        temperature: 0.8
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    const description = response.data.choices[0].message.content.trim();
    res.json({ description });
  } catch (err) {
    res.status(500).json({ error: "AI generation failed", details: err.message });
  }
};
