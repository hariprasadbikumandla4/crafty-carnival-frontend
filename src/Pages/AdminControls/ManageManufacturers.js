import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import configDetails from "../../ConfigureDetails/redirectConfig";
import AlertStatus from "../../AlertStatus";
import AddManufacturerForm from "./AddManufacturerForm";
import EditManufacturerForm from "./EditManufacturerForm";
import "../../Styles/AdminStyles/InventoryStyles.css";

const ManageManufacturers = ({ userEmail, authIdToken }) => {
  const [manufacturers, setManufacturers] = useState([]);
  const [editManufacturer, setEditManufacturer] = useState(null);
  const [alert, setAlert] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Fetch manufacturers on component mount
  useEffect(() => {
    fetchManufacturers();
  }, []);

  // Fetch manufacturers
  const fetchManufacturers = async () => {
    try {
      const url = `${configDetails.baseUrl}${configDetails.allManufacturers}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authIdToken,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch Manufacturers. Status: ${response.status}`
        );
      }

      const manufacturersData = await response.json();
      setManufacturers(manufacturersData);
    } catch (error) {
      handleAlert(
        "Failed to fetch Manufacturers. Please try again later.",
        "danger"
      );
    }
  };

  // Function to handle alerts
  const handleAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  // Function to add a new manufacturer
  const handleAddManufacturer = async (newManufacturer) => {
    try {
      const url = `${configDetails.baseUrl}${configDetails.addManufacturer}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authIdToken,
        },
        body: JSON.stringify(newManufacturer),
      });

      if (response.ok) {
        fetchManufacturers();
        setIsAddModalOpen(false); // Close the modal after adding
        handleAlert("Manufacturer added successfully.", "success");
      } else {
        handleAlert("Failed to add Manufacturer.", "danger");
      }
    } catch (error) {
      handleAlert("Failed to add Manufacturer. Please try again later.", "danger");
    }
  };

  // Function to update a manufacturer
  const handleUpdateManufacturer = async (updatedManufacturer) => {
    try {
      const url = `${configDetails.baseUrl}${configDetails.updateManufacturer}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authIdToken,
        },
        body: JSON.stringify(updatedManufacturer),
      });

      if (response.ok) {
        // Update successful, close the modal
        setIsEditModalOpen(false);
        setEditManufacturer(null);
        fetchManufacturers();
        handleAlert("Manufacturer updated successfully.", "success");
      } else {
        handleAlert("Failed to update Manufacturer.", "danger");
      }
    } catch (error) {
      handleAlert("Failed to update Manufacturer. Please try again later.", "danger");
    }
  };


  // Function to delete a manufacturer
  const handleDeleteManufacturer = async (id) => {
    try {
      const url = `${configDetails.baseUrl}${configDetails.deleteManufacturer}/${id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: authIdToken,
        },
      });

      if (response.ok) {
        fetchManufacturers();
        handleAlert("Manufacturer deleted successfully.", "success");
      } else {
        handleAlert("Failed to delete Manufacturer.", "danger");
      }
    } catch (error) {
      handleAlert("Failed to delete Manufacturer. Please try again later.", "danger");
    }
  };

  // Function to edit a manufacturer
  const handleEditManufacturer = (manufacturer) => {
    setEditManufacturer(manufacturer);
    setIsEditModalOpen(true);
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditManufacturer(null);
    setIsEditModalOpen(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Manage Manufacturers</h2>
      <button className="btn btn-primary mb-3" style={{margin:'5px'}} onClick={fetchManufacturers}>Fetch Manufacturers</button>
      <button className="btn btn mb-3" style={{margin:'5px', backgroundColor:'green'}} onClick={() => setIsAddModalOpen(true)}>Add Manufacturer</button>
      {editManufacturer ? (
        <div className="mb-3">
          <h4>Edit Manufacturer</h4>
          <EditManufacturerForm 
            manufacturer={editManufacturer} 
            onUpdate={handleUpdateManufacturer} 
            onClose={handleCancelEdit} 
          />
          </div>
      ) : null}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Website</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {manufacturers          .map(manufacturer => (
            <tr key={manufacturer.id}>
              <td>{manufacturer.name}</td>
              <td>{manufacturer.address}</td>
              <td>{manufacturer.phone}</td>
              <td>{manufacturer.email}</td>
              <td>{manufacturer.website}</td>
              <td>
                <button style={{marginRight:'20px'}} className="btn btn-sm btn-primary mr-2" onClick={() => handleEditManufacturer(manufacturer)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteManufacturer(manufacturer.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Add Manufacturer Modal */}
      <Modal isOpen={isAddModalOpen} onRequestClose={() => setIsAddModalOpen(false)}>
        <div className="modal-content">
          <h2>Add Manufacturer</h2>
          <AddManufacturerForm onAdd={handleAddManufacturer} onClose={() => setIsAddModalOpen(false)} />
          {/* Close button */}
          <button className="close-button" onClick={() => setIsAddModalOpen(false)}>Close</button>
        </div>
      </Modal>

      {/* Edit Manufacturer Modal */}
      <Modal isOpen={isEditModalOpen} onRequestClose={handleCancelEdit}>
        <div className="modal-content">
          <h2>Edit Manufacturer</h2>
          {editManufacturer && (
            <EditManufacturerForm 
              manufacturer={editManufacturer} 
              onUpdate={handleUpdateManufacturer} 
              onCancel={handleCancelEdit} 
            />
          )}
          {/* Close button */}
          <button className="close-button" onClick={handleCancelEdit}>Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default ManageManufacturers;

