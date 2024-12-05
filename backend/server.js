// server.js
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const adminRoutes = require("./routes/adminRouter");
const rentRateRoutes = require("./routes/rentRateRouter");

const app = express();
const PORT = process.env.PORT || 3001;

// console.log('process',process.env);
console.log("Port", process.env.PORT);
console.log("Mongo_URI", process.env.MONGODB_URI);
// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Add CORS middleware
const cors = require("cors");
app.use(cors());

// Add basic security headers
const helmet = require("helmet");
app.use(helmet());

// Add request rate limiting
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Route handling
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/rent-rates", rentRateRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
