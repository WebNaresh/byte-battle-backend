const express = require("express");

const auth = require("../middleware/auth");
const { getNotification } = require("../controller/notification");
const router = express.Router();
router.route("/get-notification").get(auth, getNotification);

module.exports = router;
