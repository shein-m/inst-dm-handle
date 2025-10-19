import sendInstagramMessage from "../services/igSendMessage.js";
import { generateReply } from "../ai/openaiService.js";
import { findOrCreateUser } from "../services/prismaServices/userService.js";
import { saveMessages } from "../services/prismaServices/messageService.js";
import { handleUserMessages } from "../services/prismaServices/handleUserMessages.js";

export const igWebhookVerify = (req, res) => {
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

    // ignoring my messages
    if (messaging.message && messaging.message.is_echo) {
      return res.sendStatus(200);
    }

    if (!senderId || !message) {
      return res.sendStatus(400);
    }

    // find or create user
    const user = await findOrCreateUser(senderId, message); //message instead lang
    // console.log("check user - ", user);

    // save message
    await saveMessages(user.id, "user", message);

    // create reply from ai
    const history = await handleUserMessages(user);
    const aiReply = await generateReply(message, history, user.lang);

    // save messge from ai
    await saveMessages(user.id, "assistant", aiReply);

    // send message to user
    await sendInstagramMessage(senderId, aiReply);

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    res.sendStatus(500);
  }
};
