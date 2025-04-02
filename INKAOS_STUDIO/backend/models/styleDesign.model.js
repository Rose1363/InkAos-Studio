import mongoose from "mongoose";

const styleDesignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Provide category name"],
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const StyleDesignModel = mongoose.model("StyleDesign", styleDesignSchema);
export default StyleDesignModel;
