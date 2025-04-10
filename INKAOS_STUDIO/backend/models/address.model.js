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


const AddressModel = mongoose.model("address", addressSchema);

export default AddressModel;
