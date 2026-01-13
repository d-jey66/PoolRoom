import { useParams } from "react-router";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

export default function Payment() {
  const { reservationId, price } = useParams();

  const fetchClientSecret = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/payments/create-checkout-session`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationId,
          price
        }),
      }
    );

    const data = await res.json();
    return data.clientSecret;
  };

  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ fetchClientSecret }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
