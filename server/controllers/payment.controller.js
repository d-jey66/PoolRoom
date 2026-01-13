export const createCheckoutSession = async (req, res, next) => {
  try {
    const { reservationId, price } = req.body;
    
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
            unit_amount: price * 100, 
          },
          quantity: 1,
        },
      ],
      metadata: {
        reservationId: reservationId
      },
      return_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&reservation_id=${reservationId}`,
    });
    
    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    next(err);
  }
};