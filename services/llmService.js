import ai from "../config/gemini.js";

export async function analyzeMessage(text) {
    try {
        const prompt = `
Extract shopping intent.

Return ONLY JSON.

If product query:
{
  "intent": "product_search",
  "metadata": {
    "category": "string",
    "max_price": number | null
  }
}

Else:
{
  "intent": null
}

User: ${text}
`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview", // ✅ use this
            contents: prompt,
        });

        const raw = response.text;

        const cleaned = raw
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleaned);

    } catch (err) {
        console.error("Gemini error:", err);

        // // 🔥 fallback (KEEP THIS)
        // const lower = text.toLowerCase();

        // if (lower.includes("shoes") && lower.includes("under")) {
        //   const priceMatch = lower.match(/\d+/);

        //   return {
        //     intent: "product_search",
        //     metadata: {
        //       category: "shoes",
        //       max_price: priceMatch ? Number(priceMatch[0]) : null
        //     }
        //   };
        // }

        return { intent: null };
    }
}