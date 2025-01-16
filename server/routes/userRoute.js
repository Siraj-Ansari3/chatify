const express = require("express");
const User = require("../models/user");
const { validateToken } = require("../services/authentication");
const router = express.Router();

router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        await User.create({
            fullName,
            email,
            password,
        });
        return res.status(200).json({ message: "Signup successful!" });
    } catch (err) {
        return res.status(400).json({ message: "Error creating user. Please try again." });
    }
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie("token", token, {
            httpOnly: true, // Prevents JavaScript access
            secure: false, // Set to true if using HTTPS
            sameSite: "Lax", // Adjust for your frontend-backend setup
        }).json({ message: "Signin successful" }).status(200);

    } catch (error) {
        return res.status(400).json({ message: "Signin unsuccessful!" });

    }
});

router.post("/signout", (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Signout successful" });
    } catch (error) {
        console.log(err)
        return res.status(400).json({ message: "Signout unsuccessful" });
    }
});

router.get("/verify", (req, res) => {
    const tokenCookie = req.cookies.token;

    if (!tokenCookie) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        // Validate the token
        const user = validateToken(tokenCookie);
        res.status(200).json({ message: "Authenticated", user, email: user.email });
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
});

module.exports = router;