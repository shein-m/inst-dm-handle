import LanguageDetect from "languagedetect";
import { checkLangAI } from "../../ai/helpers/checkLangAi.js";

export const languageDetect = (text, limit = 1) => {
  const lngDetector = new LanguageDetect();
  const results = lngDetector.detect(text, limit);

  if (!results || results.length === 0) {
    return "en";
  }

  const [lang, prob] = results[0];

  // add AI check language
  if (prob < 0.15) {
    const lang = checkLangAI(text);
    return lang;
  }

  if (lang === "english") return "en";
  if (lang === "ukrainian") return "uk";
  if (lang === "russian") return "ru";

  return "en";
};
