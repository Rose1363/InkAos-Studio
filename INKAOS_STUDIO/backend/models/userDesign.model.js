const userDesignSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    baseDesign: { // Design gốc (nếu có)
      type: mongoose.Schema.Types.ObjectId,
      ref: "Design"
    },
    layers: mongoose.Schema.Types.Mixed, // Copy từ design gốc hoặc tạo mới
    appliedProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    customizations: { // Tùy chỉnh riêng
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  }, { timestamps: true });