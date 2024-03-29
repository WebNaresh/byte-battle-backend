// testController a UserModel
const { send } = require("@emailjs/browser");
const catchAssyncError = require("../middleware/catchAssyncError");
const { FoodItemModel } = require("../models/foodItem");
const { NotificationModel } = require("../models/notification");
const { UserModel } = require("../models/userSchema");
const { checkRequiredFields } = require("../utils/required-field");
const { sendEmail } = require("../utils/sendEmail");

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

    var inputDate = new Date(dateOfCreation);
    var resultDate = new Date(
      inputDate.getTime() + Number(shelfLife) * 24 * 60 * 60 * 1000
    );
    const newFoodItem = await new FoodItemModel({
      name,
      serving_size,
      description,
      dateOfCreation,
      supplier: req.user._id,
      shelfLife: resultDate,
      items,
    });
    (await newFoodItem.save()).populate("supplier");

    const user = await UserModel.find({ type: "Consumer" });
    user.map((doc) => {
      sendEmail(doc.email);
    });
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

    res.status(201).json({ foodItems: foodItems.reverse(), success: true });
  } catch (error) {
    console.error("Error creating FoodItem:", error);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
});
exports.getFoodItemsGlobal = catchAssyncError(async (req, res, next) => {
  try {
    const currentDate = new Date();
    const foodItems = await FoodItemModel.find({
      serving_size: { $gt: 0 },
      shelfLife: { $gte: currentDate },
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

    const not = await new NotificationModel({
      creator: req.user._id,
      acceptor: foodItems.supplier,
      foodItemId: foodItems._id,
      quantity,
    });
    await not.save();
    res.status(201).json({
      message: "food consumer will contact you thak you",
      success: true,
    });
  } catch (error) {
    console.error("Error creating FoodItem:", error);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
});
exports.currentMonthFoodItem = catchAssyncError(async (req, res, next) => {
  try {
    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    const currentMonthFoodItem = await NotificationModel.find({
      createdAt: {
        $gte: startOfMonth,
        $lt: currentDate,
      },
    });
    const totalQuantity = currentMonthFoodItem.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    return res.status(201).json({
      currentMonthFoodItem,
      totalQuantity,
      success: true,
    });
  } catch (error) {
    console.error("Error creating FoodItem:", error);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
});
exports.currentWeekFoodItem = catchAssyncError(async (req, res, next) => {
  try {
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const currentWeekFoodItem = await NotificationModel.find({
      createdAt: {
        $gte: startOfWeek,
      },
    });
    const totalQuantity = currentWeekFoodItem.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    console.log(`🚀 ~ file: foodItem.js:162 ~ totalQuantity:`, totalQuantity);
    return res.status(201).json({
      currentWeekFoodItem,
      totalQuantity,
      success: true,
    });
  } catch (error) {
    console.error("Error creating FoodItem:", error);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
});
