import React from 'react';

function ContactList({ contacts, onContactClick }) {
  return (
    <ul className="contact-list">
      {contacts.map((contact) => (
        <li
          key={contact.id}
          onClick={() => onContactClick(contact)}
          className="contact-item"
        >
          {contact.name}
        </li>
      ))}
    </ul>
  );
}

export default ContactList;
