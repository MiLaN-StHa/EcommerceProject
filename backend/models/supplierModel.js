import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  supplierName: { 
    type: String, 
    required: true 
  },
  rawMaterials: [{
    materialName: { 
      type: String, 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true,
      min: 0 
    },
    pricePerUnit: { 
      type: Number, 
      required: true,
      min: 0 
    },
    totalAmount: { 
      type: Number, 
      required: true 
    },
    amountPaid: { 
      type: Number, 
      required: true,
      min: 0,
      default: 0 
    },
    remainingAmount: { 
      type: Number, 
      required: true 
    }
  }],
  purchaseDate: { 
    type: Date, 
    default: Date.now 
  },
  totalAmount: {
    type: Number,
    required: true
  },
  totalPaid: {
    type: Number,
    required: true,
    default: 0
  },
  totalRemaining: {
    type: Number,
    required: true
  }
});

// Pre-save middleware to calculate totals
supplierSchema.pre('save', function(next) {
  // Calculate for each raw material
  this.rawMaterials = this.rawMaterials.map(material => {
    material.totalAmount = material.quantity * material.pricePerUnit;
    material.remainingAmount = material.totalAmount - material.amountPaid;
    return material;
  });

  // Calculate supplier totals
  this.totalAmount = this.rawMaterials.reduce((sum, material) => sum + material.totalAmount, 0);
  this.totalPaid = this.rawMaterials.reduce((sum, material) => sum + material.amountPaid, 0);
  this.totalRemaining = this.totalAmount - this.totalPaid;

  next();
});

const Supplier = mongoose.model('Supplier', supplierSchema);
export default Supplier; 