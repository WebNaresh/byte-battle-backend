// testController a UserModel
const catchAssyncError = require("../middleware/catchAssyncError");
const { FoodItemModel } = require("../models/foodItem");
const { checkRequiredFields } = require("../utils/required-field");

exports.createFoodItem = catchAssyncError(async (req, res, next) => {
  console.log(req.user);
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

    const newFoodItem = new FoodItemModel({
      name,
      serving_size,
      description,
      dateOfCreation,
      supplier: req.user._id,
      shelfLife,
      items,
    });

    const savedFoodItem = await newFoodItem.save();

    res.status(201).json(savedFoodItem);
  } catch (error) {
    console.error("Error creating FoodItem:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
exports.getFoodItem = catchAssyncError(async (req, res, next) => {
  console.log(req.user);
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
    const foodItems = await FoodItemModel.find();

    res.status(201).json({ foodItems, success: true });
  } catch (error) {
    console.error("Error creating FoodItem:", error);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
});
