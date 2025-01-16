import axios from "axios";
import React, { useState, useEffect } from "react";
import "../styles/chatbox.css"; // Optional: Add styles for the chatbox
import io from "socket.io-client"
import ScrollToBottom from "react-scroll-to-bottom";
let socket = io.connect("http://localhost:8000");
import { IoSend } from "react-icons/io5";
import { TbDotsVertical } from "react-icons/tb";
import { MdDone } from "react-icons/md";

let i = 0;


function ChatBox({ contact }) {
  const [userEmail, setUserEmail] = useState(null);
  const [currentMsg, setCurrentMsg] = useState(""); // Input message
  const [messageList, setMessageList] = useState([]); // Messages to display
  const [isOptionClicked, setIsOptionClicked] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editMsgIndex, setEditMsgIndex] = useState(null);
  const [isEditMsgClicked, setIsEditMsgClicked] = useState(false);
  const [editMsgContent, setEditMsgContent] = useState("");
  const [replyingMsg, setReplyingMsg] = useState(null);

  useEffect(() => {
    // Fetch the logged-in user's email
    axios
      .get("http://localhost:8000/user/verify", { withCredentials: true })
      .then((response) => setUserEmail(response.data.user.email))
      .catch((err) => console.error("Error fetching user email:", err));
  }, []);

  // Code of websocket
  useEffect(() => {

    console.log("count: ", i++)
    if (userEmail && contact?.email) {
      const roomId = [userEmail, contact.email].sort().join("-");

      socket = io.connect("http://localhost:8000");

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      // Join the unique room
      socket.emit("join-room", roomId);
      console.log(`room: ${roomId}`);


      // Load previous messages from the backend
      socket.on("load-messages", (messages) => {
        console.log("Loaded messages:", messages);
        setMessageList(messages);
      });

      // Listen for incoming messages
      socket.on("recieve-msg", (data) => {
        console.log("Received message:", data);
        setMessageList((list) => [...list, data]);
      });

      // Handle connection errors
      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      // Cleanup socket on component unmount

      return () => {
        if (socket) {
          socket.disconnect();
          console.log("Socket disconnected");
        }
      };
    }
  }, [contact?.email, refreshKey]);

  // Function to send a message
  const sendMsg = async () => {
    if (currentMsg.trim() && userEmail && contact?.email) {
      const roomId = [userEmail, contact.email].sort().join("-");
      const messageData = {
        room: roomId,
        author: userEmail,
        message: currentMsg,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        replyTo: replyingMsg ? replyingMsg : null
      };

      // Emit the message to the server
      if (socket) {
        await socket.emit("send-msg", messageData);
        console.log("Message sent:", messageData);

        // Add the message to the sender's chat directly
        setMessageList((list) => [...list, messageData]);

        // Clear input
        setCurrentMsg("");
        setReplyingMsg(false)
        setRefreshKey((prevKey) => prevKey + 1);

      }
    }
  };



  const toggleDropdown = (e, isSent) => {
    e.stopPropagation(); // Prevent dropdown from closing when the button is clicked

    // Get button's position relative to the viewport
    const rect = e.target.getBoundingClientRect();
    const chatBoxRect = document.querySelector('.chat-box').getBoundingClientRect();

    // Default dropdown position
    let dropdownTop = rect.top + window.scrollY + rect.height + 5; // Position dropdown below button with a 5px gap
    let dropdownLeft = rect.left + window.scrollX; // Position dropdown near the button (left side)

    // Adjust for sent messages (on the right)
    if (isSent) {
      dropdownLeft = rect.left + window.scrollX - 150; // Shift dropdown to the left for sent messages
      dropdownTop = rect.top + window.scrollX - 100
    }

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
      setIsEditMsgClicked(false);
    } // Close dropdown when background is clicked
  };

  const handleOptionbtn = (e, message, index) => {
    setIsEditMsgClicked(false)
    toggleDropdown(e, message.author === userEmail)
    console.log(message)
    setSelectedMsg(message);
    setEditMsgIndex(index)
    setEditMsgContent(message.message)
  }

  const handleDeleteMsg = (messageId) => {
    axios.post(`http://localhost:8000/message/delete${messageId}`, { withCredentials: true })
      .then((response) => console.log(response))
      .catch((err) => console.error("Error deleting message:", err));
    setRefreshKey((prevKey) => prevKey + 1); // Trigger message reload
    setIsOptionClicked((prev) => !prev)
  }

  const handleEditingMsg = (index) => {
    console.log("index", index)
    setIsOptionClicked(false);
    setIsEditMsgClicked((prev) => !prev)
  }

  const handleEditMsg = (messageId, editedMsg) => {
    console.log(editedMsg);
    console.log(messageId);

    axios.post(`http://localhost:8000/message/edit${messageId}`, { editedMsg: editedMsg }, { withCredentials: true })
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
    setIsEditMsgClicked((prev) => !prev)
    setRefreshKey((prev) => prev + 1);
  }

  const handleReply = (message) => {
    setReplyingMsg(message); // Set the message being replied to
    console.log("Replying to: ", message.message);

    setIsOptionClicked(false); // Close the dropdown

    // Automatically focus the input field and add the reply prefix
    const inputField = document.querySelector(".input");
    if (inputField) {
      inputField.focus(); // Focus on the input field.

    }
  };


  return (
    <div className="chat-box" onClick={handleBackgroundClick}>


      {isOptionClicked && (
        <div
          className="dropdown-modal"
          style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside the dropdown from closing it
        >
          {selectedMsg.author === userEmail && <button className="button" onClick={() => handleDeleteMsg(selectedMsg._id)}>Delete</button>}
          {selectedMsg.author === userEmail && <button className="button" onClick={(e) => handleEditingMsg(editMsgIndex)}>Edit</button>}
          <button className="button" onClick={(e) => handleReply(selectedMsg)} >Reply</button>
        </div>
      )}


      {contact ? (
        <div className="chat-window">
          <div className="contact-nav">
            <div className="contact-detail">
              <img className="contact-img" src={`http://localhost:8000${contact.profileImage}`} />
              <span className="contact-name">{contact.firstName + " " + contact.lastName}</span>
            </div>
          </div>
          <div className="messages">
            {messageList.map((msg, index) => (
              <div key={index} className={`message ${msg.author === userEmail ? "sent" : "received"}`}>

                <div className="message-top">
                  <span className="message-author">{msg.author === userEmail ? "You" : contact.firstName + contact.lastName}</span>
                  <button onClick={(e) => handleOptionbtn(e, msg, index)} className="message-option"><TbDotsVertical /></button>
                </div>

                {msg.replyTo && (
                  <div className={`reply-box ${msg.author === userEmail ? "sent" : "received"}`}>
                    <p className="reply-author">{msg.replyTo.author === userEmail ? "You" : contact.firstName + " " + contact.lastName}</p>
                    <p className="reply-msg">{msg.replyTo.message.length > 20 ? msg.replyTo.message.substring(0, 20) + "..." : msg.replyTo.message }</p>
                  </div>
                )}



                {
                  isEditMsgClicked && editMsgIndex === index ? (
                    <div className="edit-msg-div">
                      <input
                        type="text"
                        value={editMsgContent}
                        onChange={(e) => setEditMsgContent(e.target.value)}
                      />
                      <button onClick={(e) => handleEditMsg(msg._id, editMsgContent)}>
                        <MdDone />
                      </button>
                    </div>
                  ) : (
                    <p className="message-content">{msg.message}</p>
                  )
                }



                <span className="message-time">{msg.time}</span>
              </div>
            ))}
          </div>

          <div className="chat-input">

            {replyingMsg && (
              <div className="replying-section">
                <p className="replying-message">
                  <strong>Replying to:</strong>{" "}
                  {replyingMsg.message.length > 20
                    ? replyingMsg.message.substring(0, 20) + "..."
                    : replyingMsg.message}
                </p>
                <button
                  className="cancel-reply-button"
                  onClick={() => setReplyingMsg(null)} // Clear the reply state
                >
                  ✖
                </button>
              </div>
            )}

            <input
              className="input"
              type="text"
              placeholder="Enter your message..."
              value={currentMsg}
              onChange={(e) => setCurrentMsg(e.target.value)}
            />
            <button onClick={sendMsg}><IoSend /></button>
          </div>

        </div>
      ) : (
        <h2>No contact selected</h2>
      )
      }
    </div >
  );
}

export default ChatBox;
