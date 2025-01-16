require("dotenv").config(); // Load environment variables
const jwt = require("jsonwebtoken");

const secret = "E321e321?"; // Use the secret from the .env file

function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };
    const token = jwt.sign(payload, secret); // Use the secret from .env
    return token;
}

function validateToken(token) {
    try {
        const payload = jwt.verify(token, secret); // Use the secret from .env
        return payload; // Return the decoded user data if valid
    } catch (err) {
        throw new Error("Invalid token");
    }
}

module.exports = { createTokenForUser, validateToken };
