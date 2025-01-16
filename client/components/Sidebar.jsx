import React, { useState } from 'react';
import '../styles/sidebar.css';
import { HiDotsVertical } from "react-icons/hi";
import axios from 'axios';

function Sidebar({ contacts, onContactSelect }) {
    const [isOptionClicked, setIsOptionClicked] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [selectedContact, setSelectedContact] = useState(null);
    const [deletedContact, setDeletedContact] = useState(null);

    const toggleDropdown = (e) => {
        e.stopPropagation(); // Prevent dropdown from closing when the button is clicked

        // Get button's position relative to the viewport
        const rect = e.target.getBoundingClientRect();
        const chatBoxRect = document.querySelector('.sidebar').getBoundingClientRect();

        // Default dropdown position
        let dropdownTop = rect.top + window.scrollY + rect.height + 5; // Position dropdown below button with a 5px gap
        let dropdownLeft = rect.left + window.scrollX; // Position dropdown near the button (left side)


        // Prevent dropdown from overflowing on the right side of the chat box
        if (dropdownLeft + 120 > chatBoxRect.right) {
            dropdownLeft = chatBoxRect.right - 120; // Align to the right of the chat box
        }

        // Prevent dropdown from overflowing on the left side of the chat box
        if (dropdownLeft < chatBoxRect.left) {
            dropdownLeft = chatBoxRect.left; // Align to the left of the chat box
        }

        // Prevent dropdown from overflowing on the bottom of the chat box
        if (dropdownTop + 120 > chatBoxRect.bottom) {
            dropdownTop = rect.top + window.scrollY - 120 - 5; // Position dropdown above the button
        }

        // Prevent dropdown from going above the chat box
        if (dropdownTop < chatBoxRect.top) {
            dropdownTop = chatBoxRect.top + 5; // Align to the top of the chat box with a 5px gap
        }

        // Set the new dropdown position
        setDropdownPosition({
            top: dropdownTop,
            left: dropdownLeft,
        });

        setIsOptionClicked((prev) => !prev);
    };

    const handleBackgroundClick = (e) => {
        if (isOptionClicked) {
            setIsOptionClicked(false);
        } // Close dropdown when background is clicked
    };

    const handleOptionbtn = (e, contactId) => {
        setSelectedContact(contactId);
        toggleDropdown(e);
        console.log("contactId: ", contactId);
    };

    const handleDelete = (e, selectedContactId) => {
        axios.post(`http://localhost:8000/contact/delete${selectedContactId}`)
        .then((response) => console.log(response))
        .catch((error) => console.error(error));
        setDeletedContact(selectedContactId);  //if delete button is clicked.
        setSelectedContact(null);
        setIsOptionClicked(false);
    }



    return (
        <div className="sidebar" onClick={handleBackgroundClick}>

            {isOptionClicked && (
                <div
                    className="dropdown-modal"
                    style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
                    onClick={(e) => e.stopPropagation()} // Prevent clicks inside the dropdown from closing it
                >
                    <button className="button" onClick={(e) => handleDelete(e, selectedContact)}>Delete</button>
                    <button className="button" >Edit</button>
                </div>
            )}

            <h3>Contacts</h3>
            {contacts.map((contact) => {
                return (
                     !(deletedContact === contact._id) && (<div className="contact" onClick={() => onContactSelect(contact)} key={contact._id} >
                        <div className="img-name">
                            <img src={`http://localhost:8000${contact.profileImage}`} />
                            <span>{contact.firstName + " " + contact.lastName}</span>
                        </div>
                        <button className='option' onClick={(e) => handleOptionbtn(e, contact._id)}> <HiDotsVertical /> </button>
                    </div>) 
                );
            })}
        </div>
    );
}

export default Sidebar;
