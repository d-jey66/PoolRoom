import Stripe from "stripe";

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
      return_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&reservation_id=${reservationId}`,
    });

    res.status(200).json({ clientSecret: session.client_secret });
      } catch (err) {
        console.error("Stripe checkout session creation error:", err);
        res.status(500).json({ message: "Failed to create checkout session" });
      }
    };