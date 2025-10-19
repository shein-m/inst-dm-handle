import { updateUserLanguage } from "../../services/langServices/changeLang.js";

export const toolHandler = async (toolsCall, userId) => {
    const lang = JSON.parse(toolsCall.function.arguments);

    switch (toolsCall.function.name) {
        case "change_language":
            return await updateUserLanguage(userId, lang.lang);
        default:
            console.log(`No handler for tool: ${toolsCall.name}`);
            return null;
    }
}