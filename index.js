const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
require('dotenv').config();

const app = express();
const PORT = 5000;

connectDB(); // connect to MongoDB

app.use(cors());
app.use(express.json());

app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
