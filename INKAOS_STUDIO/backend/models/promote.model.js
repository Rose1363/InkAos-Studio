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
  discount: {  // Thông tin giảm giá
    value: { type: Number, required: true },  // Giá trị khuyến mãi
    type: { type: String, enum: ['percent', 'fixed'], required: true }  // Phần trăm hay giá cố định
  },
  start_date: {  // Ngày bắt đầu
    type: Date,
    required: true
  },
  end_date: {  // Ngày kết thúc
    type: Date,
    required: true
  },
  applicable_products: [{  // Danh sách sản phẩm áp dụng khuyến mãi
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'  // Liên kết với bảng sản phẩm
  }],
  status: {  // Trạng thái khuyến mãi (còn hoạt động hay không)
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  }
}, {
  timestamps: true  // Tự động thêm createdAt và updatedAt
});

// Middleware để tự động kích hoạt khuyến mãi nếu hiện tại trong khoảng thời gian
promotionSchema.pre('save', function(next) {
  const now = new Date();
  if (this.start_date <= now && this.end_date >= now) {
    this.status = 'active';
  } else {
    this.status = 'inactive';
  }
  next();
});

module.exports = mongoose.model('Promotion', promotionSchema);
