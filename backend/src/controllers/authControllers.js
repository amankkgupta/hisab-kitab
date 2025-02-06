const customerModel = require("../models/customerModel");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const customer = await customerModel.create({
      name,
      phone,
    });
    await userModel.create({
      name,
      email,
      password,
      phone,
      userId: customer._id,
    });
    res
      .status(201)
      .json({ message: "Success ! Verification Link sent to email." });
  } catch (err) {
    // console.log(err);
    res.status(400).json({ message: "something went wrong" });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne(
      { email },
      { email: 1, password: 1, userId: 1 }
    );
    if (!user)
      return res
        .status(400)
        .json({ message: "User not Found ! Please Register" });
    if (user.password != password)
      return res
        .status(400)
        .json({ message: "Email/phone or password is Incorrect !" });
    const token = jwt.sign(
      { userId: user.userId, myId: user._id },
      process.env.JWT_SECRET
    );
    res.status(200).json({ token, message: "Login Successfully !" });
  } catch (err) {
    res.status(400).json({ message: "Server error !" });
  }
};

module.exports = { signup, signin };
