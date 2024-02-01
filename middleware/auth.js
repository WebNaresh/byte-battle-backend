const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/userSchema");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token)
      return res
        .status(400)
        .json({ success: false, message: "Invalid authorization" });

    jwt.verify(token, process.env.jWT_SECRETE, async (err, user) => {
      if (err) {
        return res.json({ message: "Authorization invalid", success: false });
      }

      const existingUser = await UserModel.findById(user.user._id);
      if (!existingUser) {
        return res
          .status(401)
          .json({ message: "User not found", success: false });
      }
      req.user = existingUser;
      next();
    });
  } catch (error) {
    console.error("Error in auth");
    return res.status(404).json({ message: error.message });
  }
};

module.exports = auth;
