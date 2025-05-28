const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const { PORT = 3001 } = process.env;

const auth = require("./middlewares/auth");
const routes = require("./routes");
const itemsRouter = require("./routes/clothingItem");
const usersRouter = require("./routes/users");

const { login, createUser } = require("./controllers/users");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.error("Connected to DB");
  })
  .catch(console.error);

app.use(cors());
app.use(express.json());

app.post("/signin", login);
app.post("/signup", createUser);
app.use("/items", itemsRouter);
app.use(auth);

app.use("/users", usersRouter);
app.use("/", routes);
app.listen(PORT, () => {
  console.error(`Listening on port ${PORT}`);
});
