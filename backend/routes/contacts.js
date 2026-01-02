const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// @route   POST /api/contacts
// @desc    Create a new contact
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Create new contact
    const contact = new Contact({
      name,
      email,
      phone,
      message,
    });

    // Save to database
    const savedContact = await contact.save();

    res.status(201).json({
      success: true,
      message: "Contact saved successfully",
      data: savedContact,
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// @route   GET /api/contacts
// @desc    Get all contacts
// @access  Public
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// @route   DELETE /api/contacts/:id
// @desc    Delete a contact
// @access  Public
router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
