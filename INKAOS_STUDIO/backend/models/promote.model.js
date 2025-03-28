const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  discount: {  
    type: Number,  
    required: true,
    min: 0,        
    max: 100      
  },
  start_date: {  
    type: Date,
    required: true,
    default: Date.now,
  },
  end_date: {  
    type: Date,
    required: true,
    validate: {
      validator: function(endDate) {
        return endDate > this.start_date;
      },
      message: "End date must be after start date",
    },
  },
  applicable_products: [{  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'  
  }],
  status: {
    type: String,
    enum: ["active", "inactive", "scheduled", "expired"],
    default: "scheduled",
  },
  code: {
    type: String,
    unique: true,
    uppercase: true,
    trim: true,
  },
}, {
  timestamps: true  
});

// Middleware để tự động cập nhật status dựa trên ngày
promotionSchema.pre("save", function(next) {
  const now = new Date();
  if (this.end_date < now) {
    this.status = "expired";
  } else if (this.start_date <= now && this.end_date >= now) {
    this.status = "active";
  }
  next();
});

module.exports = mongoose.model('Promotion', promotionSchema);