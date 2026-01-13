import express from "express";
import { createCheckoutSession } from "../controllers/payment.controller.js";

const PaymentRouter = express.Router();

PaymentRouter.post("/create-checkout-session", createCheckoutSession);

export default PaymentRouter;
