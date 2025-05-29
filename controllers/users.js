const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  NOT_FOUND,
  OK,
  DEFAULT,
  REQUEST_SUCCESS,
  BAD_REQUEST,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/constants");

// POST /signup
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(REQUEST_SUCCESS).send(userWithoutPassword);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: "Email already in use" });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user data" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

// GET /users/me
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(OK).send(userObj);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid user ID format" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

// PATCH /users/me
const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(OK).send(userObj);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

// POST /signin
const login = (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res.status(UNAUTHORIZED).send({ message: err.message });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  updateUser,
  login,
};
