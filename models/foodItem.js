const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Food Item Name"],
    },
    serving_size: {
      type: Number,
      required: [true, "Please Enter Serving Size"],
    },
    description: {
      type: String,
      required: [true, "Please Enter Description"],
    },
    dateOfCreation: {
      type: Date,
      required: [true, "Please Enter Expiry Date"],
    },
    consumer: [
      {
        consumerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        qantity: {
          type: Number,
          required: true,
        },
        pickupTime: {
          type: Date,
          required: true,
        },
      },
    ],
    available: {
      type: Boolean,
      default: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shelfLife: {
      type: Number,
      required: true,
    },
    items: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const FoodItemModel = mongoose.model("FoodItem", foodItemSchema);

module.exports = { FoodItemModel };
