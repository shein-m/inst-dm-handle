import OpenAI from "openai";

export const checkLangAI = async (text) => {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Определи язык текста. Верни только код языка (ru, uk, en).",
        },
        { role: "user", content: text },
      ],
    });
    const lang = response.choices[0].message.content.trim();

    return lang;
  } catch (err) {
    throw new Error("checkLangAI - not");
  }
};
