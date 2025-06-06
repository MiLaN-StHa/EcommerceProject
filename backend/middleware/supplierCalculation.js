// Middleware for supplier calculations
const calculateSupplierTotals = (req, res, next) => {
  try {
    const { rawMaterials } = req.body;
    
    if (rawMaterials && Array.isArray(rawMaterials)) {
      // Calculate for each raw material
      const updatedRawMaterials = rawMaterials.map(material => {
        const totalAmount = material.quantity * material.pricePerUnit;
        const remainingAmount = totalAmount - (material.amountPaid || 0);
        
        return {
          ...material,
          totalAmount,
          remainingAmount
        };
      });
      
      // Calculate supplier totals
      const totalAmount = updatedRawMaterials.reduce((sum, material) => sum + material.totalAmount, 0);
      const totalPaid = updatedRawMaterials.reduce((sum, material) => sum + (material.amountPaid || 0), 0);
      const totalRemaining = totalAmount - totalPaid;
      
      // Update request body with calculated values
      req.body.rawMaterials = updatedRawMaterials;
      req.body.totalAmount = totalAmount;
      req.body.totalPaid = totalPaid;
      req.body.totalRemaining = totalRemaining;
    }
    
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default calculateSupplierTotals;