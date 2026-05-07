import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder } from "../../../store/slices/order.slice";
import StripePaymentForm from "../../../components/UI/StripePaymentForm";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

const Checkout = () => {
  const dispatch = useDispatch();

  const [address, setAddress] = useState({
    street: "",
    city: "",
    country: "",
    zipcode: "",
    
  })

  const {
    activeOrder,
    clientSecret,
    loading
  } = useSelector((state) => state.order);

  // temporary example values
  const {cartItems} = useSelector(state => state.cart);

  const startCheckout = () => {

  const formattedItems = cartItems.items.map((item) => ({
    productId: item.productId._id,
    quantity: item.quantity
  }));

  dispatch(
    placeOrder({
      items: formattedItems,
      shippingAddress: address
    })
  );
};

  if (!clientSecret) {
    return (
      <div className="">
     
      
      <div className="space-y-4 max-w-md w-full mx-auto">
        {/* street */}
        <div>
          <label htmlFor="">Street <sup>*</sup></label>
          <input
           type="text"
           className="input"
           value={address.street}
           onChange={(e) => setAddress({...address , street:e.target.value})}
            required
           />
        </div>

        {/* street */}
        <div>
          <label htmlFor="">City <sup>*</sup></label>
          <input
           type="text"
           className="input"
           value={address.city}
           onChange={(e) => setAddress({...address , city:e.target.value})}
            required
           />
        </div>

        {/* street */}
        <div>
          <label htmlFor="">Country <sup>*</sup></label>
          <input
           type="text"
           className="input"
           value={address.country}
           onChange={(e) => setAddress({...address , country:e.target.value})}
            required
           />
        </div>

        {/* street */}
        <div>
          <label htmlFor="">zipcode <sup>*</sup></label>
          <input
           type="text"
           className="input"
           value={address.zipcode}
           onChange={(e) => setAddress({...address , zipcode:e.target.value})}
            required
           />
        </div>

        <button
        onClick={startCheckout}
        disabled={loading}
        className="btn"
      >
        {loading ? "Loading..." : "Proceed To Payment"}
      </button>

      </div>
       </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret }}
    >
      <StripePaymentForm />
    </Elements>
  );
};

export default Checkout;