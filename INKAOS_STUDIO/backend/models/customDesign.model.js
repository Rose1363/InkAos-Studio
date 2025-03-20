import mongoose from "mongoose";

const customDesignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Provide name"],
      trim: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Provide user_id"],
    },
    design_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Design",
      default: null, // Tham chiếu đến thiết kế sẵn (nếu có)
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Provide product_id"],
    },
    text_designs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TextDesign",
      },
    ],
    image_designs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ImageDesign",
      },
    ],
  },
  {
    timestamps: true,
  }
);


customDesignSchema.pre("remove", async function (next) {
  const customDesign = this;
  await mongoose.model("TextDesign").deleteMany({ _id: { $in: customDesign.text_designs } });
  await mongoose.model("ImageDesign").deleteMany({ _id: { $in: customDesign.image_designs } });
  next();
});

const CustomDesignModel = mongoose.model("CustomDesign", customDesignSchema);
export default CustomDesignModel;