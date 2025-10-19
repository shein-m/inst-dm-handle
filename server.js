import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import express from "express";
import bodyParser from "body-parser";
import webhookRoutes from "./src/routes/webhook.js";
import { findUserLanguage } from "./src/services/prismaServices/findUserLanguage.js";

const app = express();
app.use(bodyParser.json());

app.use("/webhook", webhookRoutes);
app.post("/webhook", webhookRoutes);

await findUserLanguage("1297457788492388");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
