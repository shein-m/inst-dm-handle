import axios from "axios";

const sendInstagramMessage = async (recipientId, text) => {
  const IG_ID_MY = process.env.IG_ID_MY;
  const IG_USER_TOKEN = process.env.IG_USER_TOKEN;

  try {
    const response = await axios.post(
      `https://graph.instagram.com/v23.0/${IG_ID_MY}/messages`,
      {
        recipient: { id: recipientId },
        message: { text },
      },
      {
        headers: {
          Authorization: `Bearer ${IG_USER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("📤 IG message sent:", response.data);
    return response.data;
  } catch (err) {
    console.error(
      "❌ Error sending IG message:",
      err.response?.data || err.message
    );
    throw err;
  }
};

export default sendInstagramMessage;
