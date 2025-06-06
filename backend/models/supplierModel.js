import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  supplierName: {  type: String, required: true },
  rawMaterials: [{
    materialName: { type: String,required: true },
    quantity: { type: Number,required: true,min: 0},
    pricePerUnit: { type: Number,required: true,min: 0},
    totalAmount: { type: Number,required: true },
    amountPaid: { type: Number,required: true,min: 0,default: 0},
    remainingAmount: { type: Number,required: true}
  }],
  purchaseDate: { type: Date,default: Date.now },
  totalAmount: {type: Number,required: true},
  totalPaid: {type: Number,required: true,default: 0},
  totalRemaining: {type: Number,required: true}
});

const Supplier = mongoose.model('Supplier', supplierSchema);
export default Supplier;