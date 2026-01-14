import express from "express";
import { createCheckoutSession, handleWebhook } from "../controllers/payment.controller.js";

const PaymentRouter = express.Router();

PaymentRouter.post("/webhook", express.raw({ type: 'application/json' }), handleWebhook);
PaymentRouter.post("/create-checkout-session", express.json(), createCheckoutSession);

export default PaymentRouter;