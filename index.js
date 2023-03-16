const express = require("express");
const app = express();
const port = 8000;

// Configuring environment variables
require("dotenv").config();

// Loading database
const db = require("./config/mongoose");

// Allowing cross-origin requests
const cors = require("cors");


// Fetching form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

// Routes
app.use("/", require("./routes/index"));


app.listen(port, (err) => {
   if (err) {
      console.log(`Error in running the server: ${err}`);
   }
   console.log(`Server is running on port: ${port}`);
});