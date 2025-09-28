import express from "express";
import {
  igWebhookHandle,
  igWebhookMessageHandle,
} from "../controllers/webhookControllers.js";

const router = express.Router();

router.get("/", igWebhookHandle);
router.post("/", igWebhookMessageHandle);

export default router;
