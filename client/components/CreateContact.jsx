import React, { useState } from "react";
import "../styles/CreateContact.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";



const CreateContact = () => {

    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [lastName, setLastName] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            // Make a POST request to the backend to create a new user
            const response = await axios.post("http://localhost:8000/contact/create", {
                email,
                firstName,
                lastName,
            });


            if (response.status === 200) {
                setMessage(response.data.message);
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            }
        } catch (err) {
            // Handle errors (e.g., email already exists)
            const errorMessage = err.response?.data?.message || "An error occurred.";
            setError(errorMessage);
        }
    };



    return (
        <div className="create-contact-container">
            <h1>Create Contact</h1>
            <form onSubmit={handleSubmit} className="create-contact-form">
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter email here..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder="Enter first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Enter last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {message && <p style={{ color: "green" }}>{message}</p>}
                </div>
                <button type="submit" className="add-contact-btn">
                    Add Contact
                </button>
            </form>
        </div>
    );
};

export default CreateContact;
