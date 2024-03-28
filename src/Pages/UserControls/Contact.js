import React from 'react';
import './Contact.css'; // Importing CSS file for styling

function Contact() {
  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <div className="contact-info">
        <div className="contact-section">
          <p>For general inquiries: <a href="mailto:support@craftycarnival.com">support@craftycarnival.com</a></p>
          <p>M-F 09:00 AM to 05:00 PM</p>
          <p>Customer support: +1-123-456-7890</p>
        </div>
        <div className="contact-section">
          <h3>Address</h3>
          <p>123 Crafty Carnival St, Wonderland, CA 12345</p>
        </div>
        <div className="contact-section">
          <h3>Location</h3>
          <p>We are located in the heart of Wonderland, just a short walk from the main square.</p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
