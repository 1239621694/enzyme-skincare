import Stripe from "stripe";
// Uses Stripe dashboard default API version
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  typescript: true,
});