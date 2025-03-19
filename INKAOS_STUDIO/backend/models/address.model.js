import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "provide name"],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "provide phone number"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "provide address"],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

addressSchema.pre("save", async function (next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id }, isDefault: true },
      { $set: { isDefault: false } }
    );
  }
  next();
});

const AddressModel = mongoose.model("address", addressSchema);

export default AddressModel;
