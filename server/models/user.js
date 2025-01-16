const { createHmac, randomBytes } = require('node:crypto');
const mongoose = require("mongoose");
const { createTokenForUser } = require('../services/authentication');

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); // Regular expression for validating email
            },
            message: props => `${props.value} is not a valid email!` // Custom error message
        }
    },  
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: '/images/default.png'
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    const user = this;

    if (!user.isModified("password")) return; 

    const salt = await randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    user.salt = salt;
    user.password = hashedPassword;

    next();
});

userSchema.static('matchPasswordAndGenerateToken', async function(email, password) {
    const user = await this.findOne({ email });
    if(!user) throw new Error("User not found!");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

    if(hashedPassword !== userProvidedPassword) throw new Error("Incorrect Password!");
    const token = createTokenForUser(user);
    return token;
})

const User = mongoose.model('user', userSchema);

module.exports = User;
