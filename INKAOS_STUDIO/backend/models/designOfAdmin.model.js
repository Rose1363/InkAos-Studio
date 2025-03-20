import mongoose from "mongoose";

const designSchema = new mongoose.Schema(
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
      validate: {
        validator: async function (value) {
          const user = await mongoose.model("User").findById(value);
          return user && user.role === "Admin";
        },
        message: "User must be an Admin to create a Design",
      },
    },
    // product_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Product",
    //   required: [true, "Provide product_id"],
    // },
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

// Middleware để xóa TextDesign và ImageDesign khi xóa Design
designSchema.pre("remove", async function (next) {
  const design = this;
  await mongoose.model("TextDesign").deleteMany({ _id: { $in: design.text_designs } });
  await mongoose.model("ImageDesign").deleteMany({ _id: { $in: design.image_designs } });
  next();
});

const DesignModel = mongoose.model("Design", designSchema);
export default DesignModel;