import express from 'express';
import { createCustomization, getCustomizations, removeCustomization, updateCustomizationStatus } from '../controllers/customizeController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// POST route for creating a new customization
router.post('/', upload.fields([{ name: 'referenceImage', maxCount: 1 }]), createCustomization);

// GET route for fetching all customizations
router.get('/', getCustomizations);

// PATCH route for updating customization status
router.patch('/:id/status', updateCustomizationStatus);
router.post('/remove',removeCustomization);

export default router; 