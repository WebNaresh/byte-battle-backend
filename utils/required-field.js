function checkRequiredFields(req, res, requiredFields) {
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({
        success: false,
        message: `Please provide the '${field}' field.`,
      });
    }
  }
  return true;
}
module.exports = { checkRequiredFields };
