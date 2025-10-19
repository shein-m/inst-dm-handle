export const changeLanguageTools = [
  {
    type: "function",
    function: {
      name: "change_language",
      description: "Change language when user asks for that",
      parameters: {
        type: "object",
        properties: {
          lang: {
            type: "string",
            description: "Target language code (ru, uk, en)",
          },
        },
        required: ["lang"],
      },
    },
  },
];
