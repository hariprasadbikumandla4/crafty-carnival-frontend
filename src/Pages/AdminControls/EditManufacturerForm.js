import React, { useState } from "react";
import "../../Styles/AdminStyles/AddManufacturerForm.css"; // Import CSS file for styling

const EditManufacturerForm = ({ manufacturer, onUpdate, onClose }) => {
  const [editedManufacturer, setEditedManufacturer] = useState(manufacturer);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editedManufacturer);
    onClose(); 
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>Edit Manufacturer</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name:</label>
            <input
              type="text"
              id="name"
              value={editedManufacturer.name}
              onChange={(e) => setEditedManufacturer({ ...editedManufacturer, name: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address" className="form-label">Address:</label>
            <input
              type="text"
              id="address"
              value={editedManufacturer.address}
              onChange={(e) => setEditedManufacturer({ ...editedManufacturer, address: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone:</label>
            <input
              type="text"
              id="phone"
              value={editedManufacturer.phone}
              onChange={(e) => setEditedManufacturer({ ...editedManufacturer, phone: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              id="email"
              value={editedManufacturer.email}
              onChange={(e) => setEditedManufacturer({ ...editedManufacturer, email: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="website" className="form-label">Website:</label>
            <input
              type="text"
              id="website"
              value={editedManufacturer.website}
              onChange={(e) => setEditedManufacturer({ ...editedManufacturer, website: e.target.value })}
              className="form-input"
            />
          </div>
          <button type="submit" className="form-submit">Update</button>
        </form>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default EditManufacturerForm;
