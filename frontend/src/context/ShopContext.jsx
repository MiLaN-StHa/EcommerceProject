import React, { useEffect, useState, createContext } from "react";
import { useNavigate } from "react-router";
import axios from 'axios';
import { toast } from 'react-toastify';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = 'Rs.';
    const delivery_fee = 70;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    // ✅ Fix: Properly Update Cart Items
    const addToCart = async (itemId) => {
        setCartItems(prevCart => ({
            ...prevCart,
            [itemId]: (prevCart[itemId] || 0) + 1  // Increment count
        }));

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    // ✅ Fix: Correctly Count Items in Cart
    const getCartCount = () => {
        return Object.values(cartItems).reduce((total, count) => total + count, 0);
    };

    // ✅ Fix: Update quantity in the cart
    const updateQuantity = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/update', { itemId, quantity }, { headers: { token } });
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            }
        }
    };

    // ✅ Fix: Get total cart amount
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const itemInfo = products.find((product) => product._id === itemId);
            if (itemInfo && cartItems[itemId] > 0) {
                totalAmount += itemInfo.price * cartItems[itemId]; // Multiply price by quantity
            }
        }
        return totalAmount;
    };

    const gerProductData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            if (response.data.success) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Fetch product data when component mounts
    useEffect(() => {
        gerProductData();
    }, []);

    // Fetch cart data when the token is set
    useEffect(() => {
        if (token) {
            getUserCart(token);
        }
    }, [token]);  // This runs whenever the token changes

    // Set token from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch, setCartItems,
        cartItems, addToCart, getCartCount, updateQuantity, getCartAmount, navigate, backendUrl, setToken, token
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
