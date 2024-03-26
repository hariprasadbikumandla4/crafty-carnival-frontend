import React, { useState } from "react";
import "../../Styles/AdminStyles/AddManufacturerForm.css";

const AddManufacturerForm = ({ onAdd, onClose }) => {
  const [manufacturer, setManufacturer] = useState({ manufacturerName: "", manufacturerAddress: "", manufacturerPhone: "", manufacturerEmail: "", manufacturerWebsite: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(manufacturer);
    setManufacturer({ manufacturerName: "", manufacturerAddress: "", manufacturerPhone: "", manufacturerEmail: "", manufacturerWebsite: "" });
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
              value={manufacturer.manufacturerName}
              onChange={(e) => setManufacturer({ ...manufacturer, manufacturerName: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address" className="form-label">Address:</label>
            <input
              type="text"
              id="address"
              value={manufacturer.manufacturerAddress}
              onChange={(e) => setManufacturer({ ...manufacturer, manufacturerAddress: e.target.value })}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone:</label>
            <input
              type="text"
              id="phone"
              value={manufacturer.manufacturerPhone}
              onChange={(e) => setManufacturer({ ...manufacturer, manufacturerPhone: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              id="email"
              value={manufacturer.manufacturerEmail}
              onChange={(e) => setManufacturer({ ...manufacturer, manufacturerEmail: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="website" className="form-label">Website:</label>
            <input
              type="text"
              id="website"
              value={manufacturer.manufacturerWebsite}
              onChange={(e) => setManufacturer({ ...manufacturer, manufacturerWebsite: e.target.value })}
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
