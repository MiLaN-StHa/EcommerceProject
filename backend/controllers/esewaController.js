import axios from "axios";
import { createHmac } from "crypto";
import { v4 as uuidv4 } from 'uuid';

export const initiatePayment = async (req, res) => {
    try {
        const { amount, orderId } = req.body;
        const transaction_uuid = uuidv4();

        // Generate payment hash
        const data = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;
        const secretKey = process.env.ESEWA_SECRET_KEY;
        const hash = createHmac("sha256", secretKey)
            .update(data)
            .digest("base64");

        // Prepare payment data
        const paymentData = {
            amount: amount,
            tax_amount: 0,
            delivery_amount: 0,
            total_amount: amount,
            transaction_uuid: transaction_uuid,
            product_code: process.env.ESEWA_PRODUCT_CODE,
            signature: hash,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            success_url: `${process.env.FRONTEND_URL}/payment/success`,
            failure_url: `${process.env.FRONTEND_URL}/payment/failure`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
        };

        // Generate payment URL
        const paymentUrl = `${process.env.ESEWA_GATEWAY_URL}/api/epay/main/v2/form`;
        
        res.json({
            success: true,
            paymentUrl,
            paymentData
        });
    } catch (error) {
        console.error('Payment initiation error:', error);
        res.status(500).json({ success: false, message: 'Payment initiation failed' });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { data } = req.body;
        
        // Decode base64 data
        const decodedData = Buffer.from(data, 'base64').toString();
        const paymentData = JSON.parse(decodedData);

        // Verify signature
        const verifyData = `transaction_code=${paymentData.transaction_code},status=${paymentData.status},total_amount=${paymentData.total_amount},transaction_uuid=${paymentData.transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE},signed_field_names=${paymentData.signed_field_names}`;
        
        const secretKey = process.env.ESEWA_SECRET_KEY;
        const hash = createHmac("sha256", secretKey)
            .update(verifyData)
            .digest("base64");

        if (hash !== paymentData.signature) {
            throw new Error('Invalid payment signature');
        }

        // Verify transaction status
        const response = await axios.get(
            `${process.env.ESEWA_GATEWAY_URL}/api/epay/transaction/status/?product_code=${process.env.ESEWA_PRODUCT_CODE}&total_amount=${paymentData.total_amount}&transaction_uuid=${paymentData.transaction_uuid}`
        );

        if (
            response.data.status !== "COMPLETE" ||
            response.data.transaction_uuid !== paymentData.transaction_uuid ||
            Number(response.data.total_amount) !== Number(paymentData.total_amount)
        ) {
            throw new Error('Invalid transaction data');
        }

        // Update order status in your database here
        // await updateOrderStatus(paymentData.transaction_uuid, 'paid');

        res.json({ 
            success: true, 
            message: 'Payment verified successfully',
            transactionData: response.data
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message || 'Payment verification failed' 
        });
    }
};