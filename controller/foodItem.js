// testController a UserModel
const catchAssyncError = require("../middleware/catchAssyncError");
const { FoodItemModel } = require("../models/foodItem");
const { NotificationModel } = require("../models/notification");
const { checkRequiredFields } = require("../utils/required-field");

exports.createFoodItem = catchAssyncError(async (req, res, next) => {
  try {
    const {
      name,
      serving_size,
      description,
      dateOfCreation,
      shelfLife,
      items,
    } = req.body;
    checkRequiredFields(req, res, [
      "name",
      "serving_size",
      "description",
      "dateOfCreation",
      "shelfLife",
      "items",
    ]);

    const newFoodItem = await new FoodItemModel({
      name,
      serving_size,
      description,
      dateOfCreation,
      supplier: req.user._id,
      shelfLife,
      items,
    });
    await newFoodItem.save();

    res
      .status(201)
      .json({ status: true, message: "Food is created successfully" });
  } catch (error) {
    console.error("Error creating FoodItem:", error);
    res
      .status(500)
      .json({ message: "Error creating FoodItem", success: false });
  }
});
exports.getFoodItem = catchAssyncError(async (req, res, next) => {
  try {
    const foodItems = await FoodItemModel.find({ supplier: req.user._id });

    res.status(201).json({ foodItems, success: true });
  } catch (error) {
    console.error("Error creating FoodItem:", error);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
});
exports.getFoodItemsGlobal = catchAssyncError(async (req, res, next) => {
  try {
    const foodItems = await FoodItemModel.find({
      serving_size: { $gt: 0 },
    });
    foodItems.reverse();

    res.status(201).json({ foodItems, success: true });
  } catch (error) {
    console.error("Error creating FoodItem:", error);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
});
exports.getFood = catchAssyncError(async (req, res, next) => {
  try {
    const { quantity, time } = req.body;
    if (!quantity || !time) {
      return res.status(201).json({
        message: "Please provide all necessary inputs",
        success: false,
      });
    }
    const foodItemId = req.params.foodItemId;
    const foodItems = await FoodItemModel.findById(foodItemId);
    if (!foodItems) {
      return res
        .status(201)
        .json({ message: "food Item not found", success: false });
    }
    await foodItems.consumer.push({
      consumerId: req.user._id,
      qantity: quantity,
      pickupTime: time,
    });
    foodItems.serving_size = foodItems.serving_size - quantity;
    foodItems.save();
    res.status(201).json({
      message: "food consumer will contact you thak you",
      success: true,
    });
    const not = await new NotificationModel({
      creator: req.user._id,
      acceptor: foodItems.supplier,
      foodItemId: foodItems._id,
    });
    console.log(`🚀 ~ file: foodItem.js:42 ~ not:`, not);
    await not.save();
  } catch (error) {
    console.error("Error creating FoodItem:", error);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
});
