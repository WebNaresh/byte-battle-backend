const express = require("express");
const {
  createFoodItem,
  getFoodItem,
  getFoodItemsGlobal,
} = require("../controller/foodItem");
const auth = require("../middleware/auth");
const router = express.Router();
router.route("/create-food-item").post(auth, createFoodItem);
router.route("/get-food-item").get(auth, getFoodItem);
router.route("/get-food-item-global").get(getFoodItemsGlobal);

module.exports = router;
