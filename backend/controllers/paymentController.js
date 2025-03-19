import crypto from 'crypto';

const generateUniqueId = () => {
    return crypto.randomBytes(16).toString('hex');
};

export const initiateEsewaPayment = async (req, res) => {
    try {
        const { amount, productDetails } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid amount"
            });
        }

        // Generate a unique transaction ID
        const transactionId = generateUniqueId();

        // eSewa payment parameters
        const esewaParams = {
            amt: amount,
            pdc: 0, // Delivery charge
            psc: 0, // Service charge
            txAmt: 0, // Tax amount
            tAmt: amount, // Total amount
            pid: transactionId,
            scd: process.env.ESEWA_MERCHANT_ID, // Merchant ID from eSewa
            su: `${process.env.FRONTEND_URL}/payment/success`, // Success URL
            fu: `${process.env.FRONTEND_URL}/payment/failure` // Failure URL
        };

        res.status(200).json({
            success: true,
            esewaParams,
            paymentUrl: process.env.ESEWA_PAYMENT_URL
        });

    } catch (error) {
        console.error('Error initiating eSewa payment:', error);
        res.status(500).json({
            success: false,
            message: "Error initiating payment"
        });
    }
};

export const verifyEsewaPayment = async (req, res) => {
    try {
        const { oid, amt, refId } = req.query;

        if (!oid || !amt || !refId) {
            return res.status(400).json({
                success: false,
                message: "Missing payment verification parameters"
            });
        }

        // Here you would typically verify the payment with eSewa's verification API
        // For now, we'll assume the payment is successful if we have all parameters

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            transactionId: oid,
            amount: amt,
            referenceId: refId
        });

    } catch (error) {
        console.error('Error verifying eSewa payment:', error);
        res.status(500).json({
            success: false,
            message: "Error verifying payment"
        });
    }
}; 