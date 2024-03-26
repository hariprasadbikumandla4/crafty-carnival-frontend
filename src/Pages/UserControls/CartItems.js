import React, { useEffect, useState } from "react";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import "../../Styles/UserPageStyles/CartItems.css";
import CheckoutForm from "./CheckoutForm";
import configDetails from "../../ConfigureDetails/redirectConfig";
import '../../Styles/AdminStyles/Spinner.css';

const stripePromise = loadStripe('pk_test_51OnwcNGMy5ZyUXeSrSWG3ytVYUx6qMm8568XrbFPSjwEO5uXwpt97DeXLVnD0Cyq2ivs1j8zGnVNcj0bvSARKrq100BBXTBu9v');

const CartItems = ({ userEmail, userName, userPhone, authIdToken }) => {
  const [userCartItems, setUserCartItems] = useState([]);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, [userEmail]);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const api = `${configDetails.baseUrl}${configDetails.getUserCartItems}?email=${userEmail}`;
      const response = await fetch(api, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          'Authorization': authIdToken
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        setUserCartItems(responseData);
        const total = responseData.reduce((acc, item) => acc + item.carnivalProducts.productPrice * item.cartItemQuantity, 0);
        setTotalCartPrice(total);
      } else {
        console.error("Error in getting cart items.");
      }
    } catch (error) {
      console.error("Failed to get cart items.", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if(userCartItems.length>0){
      setShowCheckoutForm(true);
    }else{
      alert("No products in the cart. Please add products before checkout.")
    } 
  };

  const handleCloseCheckoutForm = () => {
    setShowCheckoutForm(false);
  };

 if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p style={{ textAlign: 'center' }}>Loading Cart Items...</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 className="cart-heading">Your Shopping Cart</h2>
      <div className="cart-items">
        {userCartItems.length > 0 ? userCartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <img src={item.carnivalProducts?.imageUrls?.[0] || "https://jmva.or.jp/wp-content/uploads/2018/07/noimage.png"} alt={item.product?.productName} className="item-image" />
              <div className="item-details">
              <h4 className="item-name">{item.carnivalProducts?.productName}</h4>
              <p className="item-description">{item.carnivalProducts?.productDescription}</p>
              <div className="quantity-price">
                <span>Quantity: {item.cartItemQuantity}</span>
                <span>Price: ${item.carnivalProducts?.productPrice.toFixed(2)}</span>
                <span>Total: ${(item.carnivalProducts?.productPrice * item.cartItemQuantity.toFixed(2))}</span>
              </div>
            </div>
          </div>
        )) : (
          <p>No products in your cart.</p>
        )}
      </div>
      <div className="cart-summary">
        <h3>Cart Summary</h3>
        <p>Total: ${totalCartPrice.toFixed(2)}</p>
        <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
      </div>

      {showCheckoutForm && (
        <Elements stripe={stripePromise}>
          <CheckoutForm
            onClose={handleCloseCheckoutForm}
            userEmail={userEmail}
            totalCartPrice={totalCartPrice}
            name={userName}
            phoneNumber={userPhone}
            allUserCartItems={userCartItems}
            authIdToken={authIdToken}
          />
        </Elements>
      )}
    </div>
  );
};

export default CartItems;