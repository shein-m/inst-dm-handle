import LanguageDetect from "languagedetect";

export const LngDetect = (text, limit) => {
  const lngDetector = new LanguageDetect();
  const results = lngDetector.detect(text, limit);

  const [lang, prob] = results[0];

  if (prob < 0.2) return "en";
  if (lang === "ukranian") return "uk";
  if (lang === "english") return "en";
  if (lang === "russian") return "ru";

  return "en";
};
