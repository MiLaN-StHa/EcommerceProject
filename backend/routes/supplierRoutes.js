import express from 'express';
import {
  addSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  removeSupplier,
  updatePayment
} from '../controllers/supplierController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Protected routes (admin only)
router.post('/add', adminAuth, addSupplier);
router.get('/list', adminAuth, getSuppliers);
router.get('/:id', adminAuth, getSupplierById);
router.put('/:id', adminAuth, updateSupplier);
router.post('/remove', adminAuth, removeSupplier);
router.post('/payment/update', adminAuth, updatePayment);

export default router; 