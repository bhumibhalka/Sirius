import Stripe from 'stripe';
import { ENV } from './ENV.js';

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY, {
  apiVersion: "2026-04-22.dahlia"
});


export default stripe;