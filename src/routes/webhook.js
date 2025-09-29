import express from "express";
import {
  igWebhookVerify,
  igWebhookMessageHandle,
} from "../controllers/webhookControllers.js";

const router = express.Router();

router.get("/", igWebhookVerify);
router.post("/", igWebhookMessageHandle);

export default router;
