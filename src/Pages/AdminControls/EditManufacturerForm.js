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
              value={editedManufacturer.manufacturerName}
              onChange={(e) => setEditedManufacturer({ ...editedManufacturer, manufacturerName: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address" className="form-label">Address:</label>
            <input
              type="text"
              id="address"
              value={editedManufacturer.manufacturerAddress}
              onChange={(e) => setEditedManufacturer({ ...editedManufacturer, manufacturerAddress: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone:</label>
            <input
              type="text"
              id="phone"
              value={editedManufacturer.manufacturerPhone}
              onChange={(e) => setEditedManufacturer({ ...editedManufacturer, manufacturerPhone: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              id="email"
              value={editedManufacturer.manufacturerEmail}
              onChange={(e) => setEditedManufacturer({ ...editedManufacturer, manufacturerEmail: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="website" className="form-label">Website:</label>
            <input
              type="text"
              id="website"
              value={editedManufacturer.manufacturerWebsite}
              onChange={(e) => setEditedManufacturer({ ...editedManufacturer, manufacturerWebsite: e.target.value })}
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
