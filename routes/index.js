const router = require("express").Router();
const { DEFAULT } = require("../utils/constants");

const userRouter = require("./users");
const clothingItem = require("./clothingItem");

router.use("/items", clothingItem);
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(DEFAULT).send({ message: "Router not found" });
});

module.exports = router;
