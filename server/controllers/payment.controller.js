import Stripe from "stripe";
import Reservation from "../models/reservation.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res, next) => {
  try {
    const { reservationId, price, duration } = req.body;

    if (!reservationId || !price || !duration) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded",
      line_items: [
        {
          price_data: {
            currency: "gel",
            product_data: {
              name: "Pool Table Reservation",
              description: `Reservation ID: ${reservationId}`,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: duration,
        },
      ],
      metadata: { reservationId },
      return_url: `${process.env.CLIENT_URL}/?payment=success&session_id={CHECKOUT_SESSION_ID}`
    });

    res.status(200).json({ clientSecret: session.client_secret });
      } catch (err) {
        console.error("Stripe checkout session creation error:", err);
        res.status(500).json({ message: "Failed to create checkout session" });
      }
};


export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await Reservation.findByIdAndUpdate(session.metadata.reservationId, {
      paymentStatus: 'paid'
    });
  }
  
  res.json({ received: true });
};