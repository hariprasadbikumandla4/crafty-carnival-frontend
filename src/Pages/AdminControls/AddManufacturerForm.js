import React, { useState } from "react";
import "../../Styles/AdminStyles/AddManufacturerForm.css"; // Import CSS file for styling

const AddManufacturerForm = ({ onAdd, onClose }) => {
  const [manufacturer, setManufacturer] = useState({ name: "", address: "", phone: "", email: "", website: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(manufacturer);
    setManufacturer({ name: "", address: "", phone: "", email: "", website: "" });
    onClose();
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>Add Manufacturer</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name:</label>
            <input
              type="text"
              id="name"
              value={manufacturer.name}
              onChange={(e) => setManufacturer({ ...manufacturer, name: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address" className="form-label">Address:</label>
            <input
              type="text"
              id="address"
              value={manufacturer.address}
              onChange={(e) => setManufacturer({ ...manufacturer, address: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone:</label>
            <input
              type="text"
              id="phone"
              value={manufacturer.phone}
              onChange={(e) => setManufacturer({ ...manufacturer, phone: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              id="email"
              value={manufacturer.email}
              onChange={(e) => setManufacturer({ ...manufacturer, email: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="website" className="form-label">Website:</label>
            <input
              type="text"
              id="website"
              value={manufacturer.website}
              onChange={(e) => setManufacturer({ ...manufacturer, website: e.target.value })}
              className="form-input"
            />
          </div>
          <button type="submit" className="form-submit">Add</button>
        </form>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AddManufacturerForm;
