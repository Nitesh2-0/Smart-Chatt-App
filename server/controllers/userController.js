const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.json({ msg: "This username already exist.", status: false });
    }
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.json({ msg: "This email already exist.", status: false })
    }
    const hasedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username, email, password: hasedPassword
    })
    delete user.password
    return res.json({
      msg: "Account created successfully!",
      status: true,
      user
    });
  } catch (ex) {
    console.log(ex);
    next(ex)
  }
}

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ msg: "Invalid email id!", status: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ msg: "Incorrect password!", status: false })
    }
    return res.json({ msg: "Login successfull!", status: true, user })
  } catch (ex) {
    console.log(ex);
    next(ex)
  }
}

module.exports.profile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { image } = req.body;
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage: image
    }, { new: true })
    return res.json({
      msg: "Avatar selected successfully!", isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    })
  } catch (error) {
    console.log(ex);
    next(ex)
  }
}

module.exports.allUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
      "status"
    ]);
    return res.json({ msg: "All user founded!", status: true, users })
  } catch (ex) {
    console.log(error);
    next(ex)
  }
}