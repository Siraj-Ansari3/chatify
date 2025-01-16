const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Assuming you have a User model, replace with the actual model name
        required: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); // Email regex
            },
            message: props => `${props.value} is not a valid email!`
        }
    },    
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    profileImage: {
        type: String,
        default: "/images/default.png"
    }
}, { timestamps: true });

// Add a compound index for createdBy + email
contactSchema.index({ createdBy: 1, email: 1 }, { unique: true });

const Contact = mongoose.model('contact', contactSchema);

module.exports = Contact;
