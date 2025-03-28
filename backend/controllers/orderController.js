import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

//global variables 
const currency = 'npr'
const deliveryCharge= 70


// Placing order using COD method

const placeOrder = async (req,res) => {
    try {
        const {userId, items, amount, address} = req.body;
        const orderData = {
            userId,
            items,
            address,
            amount, 
            paymentMethod:"COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, {cartData:{}})

        res.json({success:true, message:"Order Placed"})
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
        
    }
}


// Placing order using esewa method

const placeOrderEsewa = async (req,res) => {
    try {
        const {userId, items, amount, address} = req.body;
        const {orgin} = req.headers

        const orderData = {
            userId,
            items,
            address,
            amount, 
            paymentMethod:"e-sewa",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()
        const line_items =items.map((item)=>({
            price_data:{
                currency: currency,
                product_data:{
                    name: item.name,
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data:{
                currency: currency,
                product_data:{
                    name: 'Delivery_Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        
       
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}



// Placing order using khalti method

const placeOrderImePay = async (req,res) => {
    
}

//Alll orders data for Admin panel
const allOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({})
        res.json({success:true,orders})
    } catch (error) {
        onsole.log(error);
        res.json({success:false, message:error.message})
    }
}

//Alll orders data for Frontend
const userOrders = async (req,res) => {
    try {
        const {userId}=req.body

        const orders = await orderModel.find({userId})
        res.json({success:true, orders})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}
//Update order status from Admin panel
const updateStatus = async (req,res) => {
    try {
        const {orderId, status} = req.body
        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({success:true, message:"Status Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

export {placeOrder,placeOrderEsewa,placeOrderImePay,allOrders,userOrders,updateStatus}