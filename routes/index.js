const router = require("express").Router();
const { NOT_FOUND } = require("../utils/constants");

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItem");
const auth = require("../middlewares/auth");
const { createUser, login } = require("../controllers/users");

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/items", clothingItemRouter);

router.use(auth);

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
