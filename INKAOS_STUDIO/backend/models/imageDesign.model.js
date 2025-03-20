import mongoose from "mongoose";

const imageDesignSchema = new mongoose.Schema(
  {
    image_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      required: [true, "Provide image_id"],
    },
    position_x: {
      type: Number,
      required: [true, "Provide position_x"],
    },
    position_y: {
      type: Number,
      required: [true, "Provide position_y"],
    },
    scaleX: {
      type: Number,
      default: 1,
    },
    scaleY: {
      type: Number,
      default: 1,
    },
    rotation: {
      type: Number,
      default: 0,
    },
    flipX: {
      type: Boolean,
      default: false,
    },
    flipY: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ImageDesignModel = mongoose.model("ImageDesign", imageDesignSchema);
export default ImageDesignModel;