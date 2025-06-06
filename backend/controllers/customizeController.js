import { v2 as cloudinary } from 'cloudinary';
import Customization from '../models/customizationModel.js';

export const createCustomization = async (req, res) => {
  try {
    const { 
      productId, 
      customizationType, 
      description, 
      additionalNotes,
      customerName,
      customerContact 
    } = req.body;
    
    if (!productId || !customizationType || !description || !customerName || !customerContact) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let referenceImage = null;
    if (req.files && req.files.referenceImage) {
      const image = req.files.referenceImage[0];
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: 'image'
      });
      referenceImage = result.secure_url;
    }

    const customization = new Customization({
      productId,
      customizationType,
      description,
      referenceImage,
      customerName,
      customerContact,
      status: 'pending'
    });

    await customization.save();
    
    res.status(201).json({
      success: true,
      message: 'Customization request created successfully',
      customization
    });
  } catch (error) {
    console.error('Error creating customization:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating customization request',
      error: error.message 
    });
  }
};

export const getCustomizations = async (req, res) => {
  try {
    const customizations = await Customization.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      customizations
    });
  } catch (error) {
    console.error('Error fetching customizations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customizations',
      error: error.message
    });
  }
};

export const removeCustomization = async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Customization ID is required'
      });
    }

    const deletedCustomization = await Customization.findByIdAndDelete(id);
    
    if (!deletedCustomization) {
      return res.status(404).json({
        success: false,
        message: 'Customization not found'
      });
    }

    res.json({
      success: true,
      message: 'Customization deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting customization:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting customization',
      error: error.message
    });
  }
};

export const updateCustomizationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const customization = await Customization.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!customization) {
      return res.status(404).json({
        success: false,
        message: 'Customization not found'
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      customization
    });
  } catch (error) {
    console.error('Error updating customization status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating customization status',
      error: error.message
    });
  }
}; 