import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    color: { type: String, required: true },
    colorCode: {
      type: String, 
      required: true,
      default: "#000000" 
    },
    sizes: [ 
      {
        name: { type: String, required: true }, // size -> name
        price: { type: Number, required: true, min: 0 },
        stock: { type: Number, required: true, min: 0 }
      }
    ]
  },
  { timestamps: true }
);

const VariantModel = mongoose.model("Variant", variantSchema);

export default VariantModel;
