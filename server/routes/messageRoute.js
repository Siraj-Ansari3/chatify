const express = require("express");
const Message = require("../models/message");
const router = express.Router();


router.post('/delete:messageId', async (req, res) => {
    try {
      const messageId = req.params.messageId; // Extract messageId from the request params
      console.log("Deleting message with ID:", req.params.messageId);
  
      // Delete the message from the database
      const deletedMessage = await Message.findByIdAndDelete(messageId);
  
      if (!deletedMessage) {
        return res.status(404).json({ error: "Message not found" });
      }
      console.log("message deleted")
      res.status(200).json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ error: "An error occurred while deleting the message" });
    }
  });


  router.post("/edit:messageId", async (req, res) => {
    try {
      const messageId = req.params.messageId; // Extract message ID from URL
      const newContent = req.body.editedMsg; // Extract the new message content from request body
  
      console.log("Message ID:", messageId);
      console.log("New Content:", newContent);
  
      // Update the message in the database
      const updatedMessage = await Message.findByIdAndUpdate(
        messageId, // The ID of the message to update
        { $set: { message: newContent } }, // Update the 'message' field
        { new: true } // Return the updated document
      );
  
      if (!updatedMessage) {
        return res.status(404).json({ error: "Message not found" }); // If no message is found
      }
  
      // Respond with the updated message
      res.status(200).json({ success: true, updatedMessage });
    } catch (error) {
      console.error("Error updating message:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  });




module.exports = router;