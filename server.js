import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

const app = express();
app.use(bodyParser.json());
dotenv.config({ path: ".env" });

const APP_ID = process.env.APP_ID; // твой App ID
const APP_SECRET = process.env.APP_SECRET; // из консоли
const REDIRECT_URI = process.env.REDIRECT_URI;

// link
app.get("/link", (req, res) => {
  const scopes = [
    "pages_show_list",
    "pages_read_engagement",
    "instagram_basic",
    "instagram_manage_messages",
    "instagram_manage_comments",
  ].join(",");

  const url =
    `https://www.facebook.com/v23.0/dialog/oauth` +
    `?client_id=${APP_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(scopes)}`;

  res.redirect(url);
});

app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "rm1_inst22_gh";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.post("/webhook", (req, res) => {
  console.log("123");
  console.log("Webhook event:", JSON.stringify(req.body, null, 2));

  const entry = req.body.entry?.[0];
  const message = entry?.messaging?.[0]?.message?.text;

  if (message) {
    console.log("User message:", message);
  }

  res.sendStatus(200);
});

// 2) Приём кода и обмен на токен
app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code in query");

  try {
    const { data } = await axios.post(
      "https://graph.facebook.com/v23.0/oauth/access_token",
      null,
      {
        params: {
          client_id: APP_ID,
          client_secret: APP_SECRET,
          redirect_uri: REDIRECT_URI,
          code,
        },
      }
    );

    console.log("Access token response:", data); // { access_token, token_type, expires_in }
    res.send(
      `<h1>✅ Авторизация успешна</h1><pre>${JSON.stringify(
        data,
        null,
        2
      )}</pre>`
    );
  } catch (e) {
    console.error(e.response?.data || e.message);
    res.status(500).send("❌ Ошибка при обмене кода на токен. См. консоль.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
