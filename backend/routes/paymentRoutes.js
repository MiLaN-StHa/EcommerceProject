import express from 'express';
import { initiateEsewaPayment, verifyEsewaPayment } from '../controllers/paymentController.js';

const paymentRouter = express.Router();

paymentRouter.post('/esewa/initiate', initiateEsewaPayment);
paymentRouter.get('/esewa/verify', verifyEsewaPayment);

export default paymentRouter; 