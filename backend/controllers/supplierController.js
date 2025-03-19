import Supplier from '../models/supplierModel.js';

// Add a new supplier
export const addSupplier = async (req, res) => {
  try {
    const { supplierName, rawMaterials, totalAmount, totalPaid, totalRemaining } = req.body;

    // Validate request body
    if (!supplierName || !rawMaterials || !Array.isArray(rawMaterials) || rawMaterials.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data. Please provide supplier name and raw materials.'
      });
    }

    // Create new supplier
    const supplier = new Supplier({
      supplierName,
      rawMaterials,
      totalAmount,
      totalPaid,
      totalRemaining
    });

    await supplier.save();

    res.status(201).json({
      success: true,
      message: 'Supplier added successfully',
      supplier
    });
  } catch (error) {
    console.error('Error in addSupplier:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding supplier'
    });
  }
};

// Get all suppliers
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .sort({ purchaseDate: -1 }); // Sort by purchase date, newest first

    res.json({
      success: true,
      transactions: suppliers
    });
  } catch (error) {
    console.error('Error in getSuppliers:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching suppliers'
    });
  }
};

// Get a single supplier by ID
export const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findById(id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    res.json({
      success: true,
      supplier
    });
  } catch (error) {
    console.error('Error in getSupplierById:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching supplier'
    });
  }
};

// Update supplier
export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { supplierName, rawMaterials, totalAmount, totalPaid, totalRemaining } = req.body;

    // Validate request body
    if (!supplierName || !rawMaterials || !Array.isArray(rawMaterials) || rawMaterials.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data. Please provide supplier name and raw materials.'
      });
    }

    const supplier = await Supplier.findByIdAndUpdate(
      id,
      {
        supplierName,
        rawMaterials,
        totalAmount,
        totalPaid,
        totalRemaining
      },
      { new: true, runValidators: true }
    );

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    res.json({
      success: true,
      message: 'Supplier updated successfully',
      supplier
    });
  } catch (error) {
    console.error('Error in updateSupplier:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating supplier'
    });
  }
};

// Remove supplier
export const removeSupplier = async (req, res) => {
  try {
    const { id } = req.body;
    const supplier = await Supplier.findByIdAndDelete(id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    res.json({
      success: true,
      message: 'Supplier removed successfully'
    });
  } catch (error) {
    console.error('Error in removeSupplier:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error removing supplier'
    });
  }
};

// Update payment for a supplier's raw material
export const updatePayment = async (req, res) => {
  try {
    const { supplierId, materialIndex, amountPaid } = req.body;

    if (!supplierId || materialIndex === undefined || amountPaid === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data. Please provide supplierId, materialIndex, and amountPaid.'
      });
    }

    const supplier = await Supplier.findById(supplierId);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }

    if (materialIndex >= supplier.rawMaterials.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid material index'
      });
    }

    // Update the amount paid for the specific material
    supplier.rawMaterials[materialIndex].amountPaid = amountPaid;
    supplier.rawMaterials[materialIndex].remainingAmount = 
      supplier.rawMaterials[materialIndex].totalAmount - amountPaid;

    // Recalculate supplier totals
    supplier.totalPaid = supplier.rawMaterials.reduce((sum, material) => sum + material.amountPaid, 0);
    supplier.totalRemaining = supplier.totalAmount - supplier.totalPaid;

    await supplier.save();

    res.json({
      success: true,
      message: 'Payment updated successfully',
      supplier
    });
  } catch (error) {
    console.error('Error in updatePayment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating payment'
    });
  }
}; 