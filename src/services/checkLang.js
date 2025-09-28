import LanguageDetect from "languagedetect";

export const LngDetect = (text, limit = 1) => {
  const lngDetector = new LanguageDetect();
  const results = lngDetector.detect(text, limit);

  if (!results || results.length === 0) return "en";

  const [lang, prob] = results[0];

  if (prob < 0.2) return "en";
  if (lang === "ukrainian") return "uk";
  if (lang === "english") return "en";
  if (lang === "russian") return "ru";

  return "en";
};
