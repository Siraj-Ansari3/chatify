import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from '../components/SignIn';
import Home from '../components/Home';
import SignUp from '../components/SignUp';
import Navbar from '../components/Navbar';
import CreateContact from '../components/CreateContact'


function App() {

  (function () {
    // Define the minimum and maximum zoom levels
    const MIN_ZOOM = 0.20; // 80%
    const MAX_ZOOM = 5; // 120%
  
    function enforceZoomRange() {
      // Detect the current zoom level
      const currentZoom = window.outerWidth / window.innerWidth;
  
      // Check if the zoom level is outside the allowed range
      if (currentZoom < MIN_ZOOM) {
        document.body.style.transform = `scale(${MIN_ZOOM / currentZoom})`;
      } else if (currentZoom > MAX_ZOOM) {
        document.body.style.transform = `scale(${MAX_ZOOM / currentZoom})`;
      } else {
        document.body.style.transform = ''; // Reset any scaling
      }
    }
  
    // Add an event listener to detect zoom changes
    window.addEventListener('resize', enforceZoomRange);
    window.addEventListener('wheel', enforceZoomRange, { passive: true });
  })();

  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/user/signin" element={<SignIn />} />
        <Route path="/" element={<Home />} />
        <Route path="/user/signup" element={<SignUp />} />
        <Route path="/createContact" element={<CreateContact />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
