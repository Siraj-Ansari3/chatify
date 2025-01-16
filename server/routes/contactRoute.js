const express = require("express");
const Contact = require('../models/contact');
const User = require("../models/user");

const router = express.Router();

router.post('/create', async (req, res) => {
    const { email, firstName, lastName } = req.body;
    const userExists = await User.findOne({ email });
    if (!userExists) {
        return res.status(404).json({ message: "User does not exist in the database" })
    }

    try {
        await Contact.create({
            createdBy: req.user._id,
            email,
            firstName,
            lastName
        });
        return res.status(200).json({ message: "Contact saved successfully!" });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Contact already exists for this user." });
        }
        return res.status(500).json({ message: "Error saving contact. Please try again." });
    }
});

router.get('/', async (req, res) => {
    try {
        const userId = req.user._id;
        const contacts = await Contact.find({ createdBy: userId })
        return res.status(200).json(contacts);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error fetching contacts." });
    }
})

router.post("/delete:contactId", async (req, res) => {
    try {
        const contactId = req.params.contactId;
        console.log("Deleting contact with ID:", req.params.contactId);

        const deletedContact = await Contact.findByIdAndDelete(contactId);

        if (!deletedContact) {
            return res.status(404).json({ error: "Contact not found" });
        }
        console.log("contact deleted")
        res.status(200).json({ success: true, message: "contact deleted successfully" });
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ error: "An error occurred while deleting the contact" });
    }
})


module.exports = router;