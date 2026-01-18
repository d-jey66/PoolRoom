import Stripe from "stripe";
import Reservation from "../models/reservation.model.js";
import Transaction from "../models/transaction.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res, next) => {
  try {
    const { reservationId, price} = req.body;

    if (!reservationId || !price) {
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
          quantity: 1,
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
  console.log('🔔 WEBHOOK RECEIVED');
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('✅ Webhook verified, event type:', event.type);
  } catch (err) {
    console.log('❌ Webhook verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  if (event.type === 'checkout.session.completed') {
    console.log('💰 Payment completed!');
    const session = event.data.object;
    const reservationId = session.metadata.reservationId;
    console.log('📝 Reservation ID:', reservationId);
      
    const reservation = await Reservation.findByIdAndUpdate(reservationId, {
      paymentStatus: 'paid'
    });
    console.log('📋 Reservation found:', reservation ? 'YES' : 'NO');
      
    if (reservation) {
      try {
        const transaction = await Transaction.create({
          reservationId: reservation._id,
          userId: reservation.userId,
          userName: reservation.user,
          amount: reservation.price,
          tableNumber: reservation.tableNumber,
          tableType: reservation.tableType,
          duration: reservation.duration || Math.round((new Date(reservation.end) - new Date(reservation.start)) / (1000 * 60 * 60)),
          paymentMethod: 'online',
          status: 'completed',
          transactionDate: new Date()
        });
        console.log('💵 Transaction created:', transaction._id);
      } catch (txError) {
        console.error('❌ TRANSACTION CREATION FAILED:', txError);
        console.error('Error details:', txError.message);
      }
    }
  }
  res.json({ received: true });
}