const express = require("express");
const {
  createFoodItem,
  getFoodItem,
  getFoodItemsGlobal,
  getFood,
} = require("../controller/foodItem");
const auth = require("../middleware/auth");
const router = express.Router();
router.route("/create-food-item").post(auth, createFoodItem);
router.route("/get-food-item").get(auth, getFoodItem);
router.route("/get-food-item-global").get(getFoodItemsGlobal);
router.route("/get-food/:foodItemId").post(auth, getFood);

module.exports = router;
