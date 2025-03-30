import mongoose from "mongoose";

const designElementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["text", "image", "shape"],
      required: true,
    },
    // Common properties
    x: { type: Number, required: true, default: 0 },
    y: { type: Number, required: true, default: 0 },
    width: { type: Number }, // Áp dụng cho image và shape (rectangle)
    height: { type: Number }, // Áp dụng cho image và shape (rectangle)
    rotation: { type: Number, default: 0 },
    scaleX: { type: Number, default: 1 },
    scaleY: { type: Number, default: 1 },
    draggable: { type: Boolean, default: true },
    opacity: { type: Number, default: 1, min: 0, max: 1 }, // Thêm opacity

    // Text properties
    text: { type: String },
    fontSize: { type: Number, min: 8, max: 72 },
    fontFamily: { type: String, default: "Arial" },
    fill: { type: String },
    align: { type: String, enum: ["left", "center", "right"] },
    fontStyle: { type: String, enum: ["normal", "bold", "italic", "bold italic"] },
    textDecoration: { type: String, enum: ["none", "underline"] },

    // Image properties
    imageUrl: { type: String },
    flipX: { type: Boolean, default: false },
    flipY: { type: Boolean, default: false },

    // Shape properties
    shapeType: {
      type: String,
      enum: [
        "rectangle",
        "circle",
        "triangle",
        "pentagon",
        "hexagon",
        "star",
        "heart",
        "cornerRectangle",
      ],
    },
    radius: { type: Number }, // Cho circle, triangle
    stroke: { type: String },
    strokeWidth: { type: Number, default: 2 },
    // Thêm các trường cho shape "star"
    innerRadius: { type: Number }, // Bán kính trong của ngôi sao
    outerRadius: { type: Number }, // Bán kính ngoài của ngôi sao
    numPoints: { type: Number },   // Số cánh của ngôi sao
    // Thêm trường bổ sung nếu cần
    cornerRadius: { type: Number }, // Cho cornerRectangle
  },
  { _id: false, versionKey: false }
);

const designSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 100,
      index: true
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true,
      index: true 
    },
   
    canvasWidth: { type: Number, default: 400 }, // Thêm từ code gốc
    canvasHeight: { type: Number, default: 500 }, // Thêm từ code gốc
    elements: [designElementSchema],
    basePrice: { 
      type: Number, 
      default: 0,
      min: 0,
      max: 1000000 // Giới hạn giá
    },
    isPublic: { 
      type: Boolean, 
      default: false,
      index: true
    },
    style: {
      type: String,
      enum: ["horror", "funny", "cute", "minimalist", "vintage", "sport", "casual"],
      required: true,
      index: true
    },
    tags: { 
      type: [String], 
      default: [],
      validate: [tagLimit, "Maximum 10 tags allowed"] // Giới hạn số lượng tags
    },
    thumbnail: { type: String },
    
  },
  { 
    timestamps: true,
    versionKey: false,
    toJSON: { 
      virtuals: true,
    },
    toObject: { virtuals: true }
  }
);

// Validate functions
function arrayLimit(val) {
  return val.length <= 50;
}

function tagLimit(val) {
  return val.length <= 10;
}

// Thêm virtual property để lấy số lượng elements
designSchema.virtual('elementsCount').get(function() {
  return this.elements.length;
});

// Thêm text index để tìm kiếm full-text
designSchema.index({
  name: "text",
  style: "text",
  tags: "text"
},{ weights: { name: 10, style: 5, tags: 1 } }
);

const DesignModel = mongoose.model("Design", designSchema);
export default DesignModel;