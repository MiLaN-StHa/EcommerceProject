import React, { useEffect, useState, createContext } from "react";
import { products } from "../assets/frontend_assets/assets";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = 'Rs.';
    const delivery_fee = 10;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});

    // ✅ Fix: Properly Update Cart Items
    const addToCart = (itemId) => {
        setCartItems(prevCart => ({
            ...prevCart, 
            [itemId]: (prevCart[itemId] || 0) + 1  // Increment count
        }));
    };

    // ✅ Fix: Correctly Count Items in Cart
    const getCartCount = () => {
        return Object.values(cartItems).reduce((total, count) => total + count, 0);
    };

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, getCartCount
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
