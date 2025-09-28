import OpenAI from "openai";
import fs from "fs";
import { fileURLToPath } from "url";

import path from "path";

export async function generateReply(userMessage, lang = "ru") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // загружаем базу знаний
  const brandData = fs.readFileSync(
    path.join(__dirname, "../data/brand.md"),
    "utf-8"
  );
  const faqData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/faq.json"), "utf-8")
  );

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
Ты — ассистент салона красоты Velvet Glow.
Используй стиль бренда: дружелюбный, конкретный, без медицинских обещаний.
Отвечай на языке клиента (${lang}).
База знаний:
${brandData}

FAQ:
${faqData.map((f) => `${f.lang}: ${f.text}`).join("\n")}
        `,
      },
      { role: "user", content: userMessage },
    ],
  });

  return response.choices[0].message.content;
}
