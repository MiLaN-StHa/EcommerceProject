import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';

const Cart = () => {
  const { products, currency, cartItems } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = Object.keys(cartItems)
      .filter(itemId => cartItems[itemId] > 0) // ✅ Only include items with quantity > 0
      .map(itemId => {
        const product = products.find(p => p._id === itemId); // ✅ Get product details
        return product ? { ...product, quantity: cartItems[itemId] } : null;
      })
      .filter(item => item !== null); // ✅ Remove null values (if product not found)

    setCartData(tempData);
  }, [cartItems, products]); // ✅ React updates when cartItems or products change

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartData.length > 0 ? (
        cartData.map((item) => (
          <div key={item._id} className="flex items-center gap-4 border-b pb-4 mb-4">
            <img src={item.image[0]} alt={item.name} className="w-20 h-20 object-cover" />
            <div>
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p>{currency}{item.price} x {item.quantity}</p>
              <p className="font-bold">Total: {currency}{item.price * item.quantity}</p>
            </div>
          </div>
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
