const {
  NOT_FOUND,
  OK,
  DEFAULT,
  REQUEST_SUCCESS,
  BAD_REQUEST,
} = require("../utils/constants");

const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send(users))
    .catch(() => {
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(REQUEST_SUCCESS).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user data" });
      }
      return res
        .status(DEFAULT)
        .send({ message: "An error has occurred on the server." });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(OK).send(user))
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

module.exports = { getUsers, createUser, getUser };
