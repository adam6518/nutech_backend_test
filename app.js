const express = require("express");

const app = express();

app.use(express.json());

const authRoute = require("./routes/authRoute");
const profileRoute = require("./routes/profileRoute");
const infoRoute = require("./routes/infoRoute");
const transactionRoute = require("./routes/transactionRoute");

app.use("/", authRoute);
app.use("/", profileRoute);
app.use("/uploads", express.static("uploads"));
app.use("/", infoRoute);
app.use("/", transactionRoute);

module.exports = app;
