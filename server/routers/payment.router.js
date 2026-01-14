import express from "express";
import { createCheckoutSession, handleWebhook } from "../controllers/payment.controller.js";

const PaymentRouter = express.Router();

PaymentRouter.post("/webhook", express.raw({ type: 'application/json' }), handleWebhook);
PaymentRouter.post("/create-checkout-session", createCheckoutSession);

export default PaymentRouter;