import mongoose from "mongoose";

const textDesignSchema = new mongoose.Schema(
  {
    width_text: {
      type: Number,
      default: 200,
    },
    height_text: {
      type: Number,
      default: 50,
    },
    position_x_text: {
      type: Number,
      required: [true, "Provide position_x_text"],
    },
    position_y_text: {
      type: Number,
      required: [true, "Provide position_y_text"],
    },
    color_text: {
      type: String,
      required: [true, "Provide color_text"],
    },
    size_text: {
      type: Number,
      required: [true, "Provide size_text"],
    },
    text: {
      type: String,
      required: [true, "Provide text"],
    },
    fontFamily: {
      type: String,
      required: [true, "Provide fontFamily"],
    },
    align: {
      type: String,
      default: "left",
    },
    fontStyle: {
      type: String,
      default: "",
    },
    textDecoration: {
      type: String,
      default: "",
    },
    rotation: {
      type: Number,
      default: 0,
    },
    scaleX: {
      type: Number,
      default: 1,
    },
    scaleY: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const TextDesignModel = mongoose.model("TextDesign", textDesignSchema);
export default TextDesignModel;