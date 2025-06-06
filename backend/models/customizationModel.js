import mongoose from 'mongoose';

const customizationSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  customizationType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  referenceImage: String,
  status: {
    type: String,
    default: 'pending'
  },
  customerName: {
    type: String,
    required: true
  },
  customerContact: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Customization = mongoose.model('Customization', customizationSchema);

export default Customization; 