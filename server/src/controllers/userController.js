const User = require("../models/User");

exports.getProfile = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updates = (({ name, currency, timezone }) => ({
      name,
      currency,
      timezone,
    }))(req.body);
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");
    res.json(user);
  } catch (err) {
    next(err);
  }
};
