const catchAssyncError = require("../middleware/catchAssyncError");
const { NotificationModel } = require("../models/notification");

exports.getNotification = catchAssyncError(async (req, res, next) => {
  try {
    const notification = await NotificationModel.find({
      acceptor: req.user._id,
    }).populate(["foodItemId", "creator", "acceptor"]);

    res.status(201).json({ notification, success: true });
  } catch (error) {
    console.error("Error creating FoodItem:", error);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
});
exports.getConsumerNotification = catchAssyncError(async (req, res, next) => {
  try {
    const approverNotification = await NotificationModel.find({
      creator: req.user._id,
    }).populate(["foodItemId", "creator", "acceptor"]);

    res.status(201).json({ approverNotification, success: true });
  } catch (error) {
    console.error("Error creating FoodItem:", error);
    res.status(500).json({ error: "Internal Server Error", success: false });
  }
});
