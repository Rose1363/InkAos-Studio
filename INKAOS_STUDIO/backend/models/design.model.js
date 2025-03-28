// import mongoose from "mongoose";

// const designElementSchema = new mongoose.Schema(
//   {
//     type: { type: String, enum: ["text", "image", "shape"], required: true },
//     // Common properties
//     x: { type: Number, required: true, default: 0 },
//     y: { type: Number, required: true, default: 0 },
//     rotation: { type: Number, default: 0 },
//     scaleX: { type: Number, default: 1 },
//     scaleY: { type: Number, default: 1 },
//     zIndex: { type: Number, default: 0 },  // Layer control
//     opacity: { type: Number, default: 1 },  // Độ trong suốt
//     // Text properties
//     text: { type: String },
//     fontSize: { type: Number },
//     fontFamily: { type: String, default: "Arial" },
//     fill: { type: String, default: "#000000" },
//     // Image properties
//     imageId: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
//     flipX: { type: Boolean, default: false },
//     flipY: { type: Boolean, default: false },
//     // Shape properties
//     shapeType: { type: String, enum: ["rect", "circle", "star"] },
//     radius: { type: Number }
//   },
//   { _id: false }
// );

// const designHistorySchema = new mongoose.Schema(
//   {
//     elements: { type: [designElementSchema], required: true },
//     timestamp: { type: Date, default: Date.now }
//   },
//   { _id: false }
// );

// const designSchema = new mongoose.Schema(
//   {
//     name: { 
//       type: String, 
//       required: true,
//       index: true  // Tối ưu tìm kiếm theo tên
//     },
//     userId: { 
//       type: mongoose.Schema.Types.ObjectId, 
//       ref: "User",
//       index: true 
//     },
//     elements: [designElementSchema],
//     history: [designHistorySchema],  // Undo/Redo (tối đa 50 bước)
//     basePrice: { 
//       type: Number, 
//       default: 0,
//       min: 0 
//     },
//     isPublic: { 
//       type: Boolean, 
//       default: false,
//       index: true  // Tối ưu filter theo trạng thái public
//     },
//     style: {  // Thêm trường style để filter
//       type: String,
//       enum: ["horror", "funny", "cute", "minimalist", "vintage"],
//       required: true,
//       index: true  // Tối ưu tìm kiếm theo style
//     },
//     tags: { 
//       type: [String], 
//       default: ["halloween"],
//       index: true  // Tối ưu tìm kiếm theo tag
//     },
//     thumbnail: { type: String }  // Ảnh xem trước
//   },
//   { 
//     timestamps: true,
//     toJSON: { virtuals: true } 
//   }
// );

// // Middleware: Giới hạn lịch sử thiết kế (tối đa 50 bước)
// designSchema.pre("save", function(next) {
//   if (this.history.length > 50) {
//     this.history.shift();
//   }
//   next();
// });

// // Middleware: Chỉ admin được public design
// designSchema.pre("save", async function(next) {
//   if (this.isModified("isPublic") && this.isPublic) {
//     const user = await mongoose.model("User").findById(this.userId);
//     if (user.role !== "admin") {
//       throw new Error("Chỉ admin được public design");
//     }
//   }
//   next();
// });

// const DesignModel = mongoose.model("Design", designSchema);
// export default DesignModel;
import mongoose from "mongoose";

const designElementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["text", "image", "shape"], // Thêm shape
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

    // Text properties
    text: { type: String }, // Chỉ áp dụng cho text
    fontSize: { type: Number, min: 8, max: 72 }, // Chỉ áp dụng cho text
    fontFamily: {
      type: String,
      default: "Arial",
    },
    fill: { type: String }, // Hỗ trợ null (trong suốt) cho text và shape
    align: { type: String, enum: ["left", "center", "right"] }, // Chỉ áp dụng cho text
    fontStyle: { type: String, enum: ["normal", "bold", "italic", "bold italic"] },
    textDecoration: { type: String, enum: ["none", "underline"] },

    // Image properties
    imageUrl: { type: String }, // Chỉ áp dụng cho image
    flipX: { type: Boolean, default: false }, // Chỉ áp dụng cho image
    flipY: { type: Boolean, default: false }, // Chỉ áp dụng cho image

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
    radius: { type: Number }, // Chỉ áp dụng cho shape (circle hoặc triangle)
    stroke: { type: String }, // Hỗ trợ null (trong suốt) cho shape
    strokeWidth: { type: Number, default: 2 }, // Chỉ áp dụng cho shape
  },
  { _id: false, versionKey: false }
);
const designHistorySchema = new mongoose.Schema(
  {
    elements: { type: [designElementSchema], required: true },
    timestamp: { type: Date, default: Date.now },
    action: { type: String } // Thêm mô tả hành động (create, update, delete)
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
    history: {
      type: [designHistorySchema],
      validate: [arrayLimit, "History exceeds the limit of 50"] // Validate thay cho pre-save hook
    },
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
      transform: function(doc, ret) {
        delete ret.history; // Ẩn history khi trả về JSON
        return ret;
      }
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
});

// Middleware pre-save để tự động tạo thumbnail nếu chưa có
designSchema.pre('save', async function(next) {
  if (!this.thumbnail && this.elements.length > 0) {
    // Logic tạo thumbnail từ element đầu tiên
    this.thumbnail = `/thumbnails/${this._id}.png`; // Giả lập
  }
  next();
});

// Middleware pre-save để validate design
designSchema.pre('save', function(next) {
  if (this.isPublic && this.elements.length === 0) {
    throw new Error("Không thể public design trống");
  }
  next();
});

const DesignModel = mongoose.model("Design", designSchema);
export default DesignModel;