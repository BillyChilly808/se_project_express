const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const { PORT = 3001 } = process.env;

const routes = require("./routes"); // index.js in routes folder

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.error("Connected to DB");
  })
  .catch(console.error);

app.use(cors());
app.use(express.json());

app.use("/", routes);

app.listen(PORT, () => {
  console.error(`Listening on port ${PORT}`);
});
