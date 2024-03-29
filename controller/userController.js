// testController a UserModel
const catchAssyncError = require("../middleware/catchAssyncError");
const sendToken = require("../utils/sendToken");
const bcrypt = require("bcryptjs");
const { UserModel } = require("../models/userSchema");

exports.test = catchAssyncError(async (req, res, next) => {
  res.status(200).json({ message: "Route is  working " });
  // const {  } = req.body
});

exports.register = catchAssyncError(async (req, res, next) => {
  const { name, email, password, phoneNo, type, address } = req.body;

  const existed = await UserModel.findOne({ email });
  if (!name || !email || !password || !phoneNo || !type || !address) {
    return res.status(400).json({
      success: false,
      message: "Please Enter all field",
    });
  }
  if (existed) {
    existed.password = null;
    return res.status(400).json({
      success: false,
      message:
        "User is already registerd please go to login page and login with credentails",
    });
  } else {
    const user = await UserModel.create({
      name,
      email,
      password,
      phoneNo,
      type,
      address,
    });
    user.password = null;
    sendToken(user, res, 200);
  }
});
// getAllUser a UserModel
exports.login = catchAssyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the user with the provided email exists
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    sendToken(user, res, 200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
