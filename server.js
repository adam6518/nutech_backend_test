require("dotenv").config();

const app = require("./app");

const pool = require("./config/db");

const PORT = process.env.PORT || 3000;

pool
  .connect()
  .then(() => {
    console.log("Database Connected Successfully !");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} !`);
    });

  })
  .catch((err) => {
    console.log(err);
  });
