const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const routesUrls = require("./routes/routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const users = require("./routes/users");
const posts = require("./routes/posts");
const tags = require("./routes/tags");
const replies = require("./routes/replies");
const participate = require("./routes/participation");

const config = require("config");

dotenv.config();

app.use(cors());

mongoose.connect(process.env.DB_PATH, (err) => {
  if (err) console.log(err);
  else console.log("mongdb is connected");
});

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("request successfully sent!");
});
app.use("/users", users);
app.use("/posts", posts);
app.use("/tags", tags);
// app.use("/participate", participate);
app.use("/reply", replies);
app.use(express.json());
app.use("/app", routesUrls);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("server is up and running"));
