const { NOT_FOUND, OK, DEFAULT, NO_CONTENT } = require("../utils/constants");
const ClothingItem = require("../models/clothingItem");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Invalid data" });
      }
      return res.status(DEFAULT).send({ message: "Error creating item" });
    });
};

const getItems = (req, res) =>
  ClothingItem.find({})
    .then((items) => res.status(OK).send(items))
    .catch((err) => {
      res.status(DEFAULT).send({ message: err.message });
    });

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  return ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(NO_CONTENT).send({}))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      return res.status(DEFAULT).send({ message: "Error deleting item" });
    });
};

const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(OK).send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }
      return res.status(DEFAULT).send({ message: "Error liking item" });
    });

const unlikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(OK).send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }
      return res.status(DEFAULT).send({ message: "Error unliking item" });
    });

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
