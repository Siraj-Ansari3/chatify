import React, { useEffect, useState } from 'react';
import ChatBox from './ChatBox';
import Sidebar from './Sidebar';
import '../styles/home.css';
import axios from 'axios';
import io from 'socket.io-client';


function Home() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  const handleContactSelect = (contact) => {
    setSelectedContact(contact)
  }

  // Fetch contacts
  useEffect(() => {
    axios.get("http://localhost:8000/contact", { withCredentials: true })
      .then(response => setContacts(response.data))
      .catch(error => console.error("Error fetching contacts:", error));
  }, []);


  return (
    <div className="container">
      <div>
      <Sidebar contacts={contacts} onContactSelect={handleContactSelect} />
      </div>
      <div >
      <ChatBox
          contact={selectedContact}
        />
      </div>
        
    </div>
  );
}

export default Home;
