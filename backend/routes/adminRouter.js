// adminRouter.js

const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

// Route to create a new admin
router.post("/", adminController.createAdmin);

// Route to get all admins
router.get("/", adminController.getAllAdmins);

// Route to delete an admin by ID
router.delete("/:id", adminController.deleteAdmin);

// Route to get an admin by email
router.get("/:email", adminController.getAdminByEmail);

module.exports = router;
