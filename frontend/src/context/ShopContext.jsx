import React, { useState } from "react";
import { createContext } from "react";
import { products } from "../assets/frontend_assets/assets"

export const ShopContext = createContext();

const ShopContextProvider = (props)=>{

    const currency='Rs.';
    const devlivery_fee=10;
    const [search,setSearch]= useState('');
    const [showSearch,setShowSearch]=useState(false);


    const value ={
        products, currency, devlivery_fee,
        search,setSearch,showSearch,setShowSearch
    }
    return(
       <ShopContext.Provider value={value}>
        {props.children}
       </ShopContext.Provider>
    )
}

export default ShopContextProvider;