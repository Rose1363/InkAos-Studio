const mongoose = require('mongoose');

// Schema cho chương trình khuyến mãi
const promotionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  discount: {  
    value: { type: Number, required: true },  
    type: { type: String, enum: ['percent', 'fixed'], required: true }  // Phần trăm hay giá cố định
  },
  start_date: {  
    type: Date,
    required: true
  },
  end_date: {  
    type: Date,
    required: true
  },
  applicable_products: [{  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'  
  }],
  status: {  
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  }
}, {
  timestamps: true  
});


module.exports = mongoose.model('Promotion', promotionSchema);
