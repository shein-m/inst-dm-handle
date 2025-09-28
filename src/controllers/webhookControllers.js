import sendInstagramMessage from "../services/igSendMessage.js";
import { generateReply } from "../services/openaiService.js";
import { LngDetect } from "../services/checkLang.js";

export const igWebhookHandle = (req, res) => {
  const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
};

export const igWebhookMessageHandle = async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const messaging = entry?.messaging?.[0];
    const senderId = messaging?.sender?.id;
    const message = messaging?.message?.text;
    const lng = LngDetect(message, 1);

    if (message && senderId) {
      const aiReply = await generateReply(message, lng);
      // console.log("🤖 AI Reply:", aiReply);
      await sendInstagramMessage(senderId, aiReply);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    res.sendStatus(500);
  }
};
