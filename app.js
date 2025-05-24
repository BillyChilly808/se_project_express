const express = require("express");
const mongoose = require("mongoose");

const app = express();
const { PORT = 3001 } = process.env;

const routes = require("./routes");
const auth = require("./middlewares/auth");
const { login, createUser } = require("./controllers/users");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.error("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());

app.post("/signin", login);
app.post("/signup", createUser);
app.use("/items", routes);

app.use(auth);

app.use("/", routes);

app.listen(PORT, () => {
  console.error(`Listening on port ${PORT}`);
});
