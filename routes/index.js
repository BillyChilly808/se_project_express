const router = require("express").Router();
const { NOT_FOUND } = require("../utils/constants");

const userRouter = require("./users");
const clothingItem = require("./clothingItem");

router.use("/items", clothingItem);
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
