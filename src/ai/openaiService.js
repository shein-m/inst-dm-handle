import OpenAI from "openai";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { changeLanguageTools } from "./tools/changeLanguageTools.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем базу знаний один раз при старте
const brandData = fs.readFileSync(
  path.join(__dirname, "../data/brand.md"),
  "utf-8"
);

const faqData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/faq.json"), "utf-8")
);

export async function generateReply(userMessage, history, lang) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // 1. Преобразуем FAQ в удобный формат
  const faqString = faqData
    .filter((f) => f.lang === lang) // берём только на нужном языке
    .map((f) => `Q: ${f.q}\nA: ${f.a}`)
    .join("\n\n");

  // 2. Системное сообщение
  const systemMessage = {
    role: "system",
    content: `
Ты — ассистент салона красоты Velvet Glow.
Говори дружелюбно, конкретно, но без медицинских обещаний.
Отвечай строго на языке клиента (${lang}).
    `,
  };

  // 3. Контекст (бренд + FAQ)
  const contextMessage = {
    role: "assistant",
    content: `
📖 База знаний:
${brandData}

❓ ЧАВО:
${faqString}
    `,
  };

  // 4. Формируем массив сообщений
  const messages = [
    systemMessage,
    contextMessage,
    ...history, // история из базы
    { role: "user", content: userMessage }, // новое сообщение
  ];

  // 5. Генерация ответа
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    tools: changeLanguageTools,
  });

  const reply = response.choices[0].message.content;

  return reply;
}
