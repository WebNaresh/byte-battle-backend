const express = require("express");

const auth = require("../middleware/auth");
const {
  getNotification,
  getConsumerNotification,
} = require("../controller/notification");
const router = express.Router();
router.route("/get-notification").get(auth, getNotification);
router.route("/get-notification-consumer").get(auth, getConsumerNotification);

module.exports = router;
