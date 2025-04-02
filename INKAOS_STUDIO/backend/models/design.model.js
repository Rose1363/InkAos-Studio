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
    width: { type: Number, min: 0 }, // Thêm min để tránh giá trị âm
    height: { type: Number, min: 0 }, // Thêm min để tránh giá trị âm
    rotation: { type: Number, default: 0 },
    scaleX: { type: Number, default: 1 },
    scaleY: { type: Number, default: 1 },
    draggable: { type: Boolean, default: true },
    opacity: { type: Number, default: 1, min: 0, max: 1 },

    // Text properties
    text: { type: String },
    fontSize: { type: Number, min: 8, max: 72 },
    fontFamily: { type: String, default: "Arial" },
    fill: { type: String, default: "#000000" }, // Thêm mặc định để tránh lỗi hiển thị
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
      enum: ["rectangle", "circle", "triangle", "pentagon", "hexagon", "star", "heart", "cornerRectangle"],
    },
    radius: { type: Number, min: 0 }, // Thêm min để tránh giá trị âm
    stroke: { type: String, default: "#000000" }, // Thêm mặc định
    strokeWidth: { type: Number, default: 2 },
    innerRadius: { type: Number, min: 0 },
    outerRadius: { type: Number, min: 0 },
    numPoints: { type: Number },
    cornerRadius: { type: Number, min: 0 },
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
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    canvasWidth: { type: Number, default: 400 },
    canvasHeight: { type: Number, default: 500 },
    elements: [designElementSchema],
    basePrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
    },
    styleDesign: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StyleDesign",
        default: null,
      },
    ],
    tags: {
      type: [String],
      default: [],
      validate: [(val) => val.length <= 10, "Maximum 10 tags allowed"],
    },
    thumbnail: { type: String, default: "https://via.placeholder.com/400" }, // Thêm mặc định
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property để lấy số lượng elements
designSchema.virtual("elementsCount").get(function () {
  return this.elements.length;
});



const DesignModel = mongoose.model("Design", designSchema);
export default DesignModel;