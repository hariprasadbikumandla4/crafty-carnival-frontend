import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import configDetails from "../../ConfigureDetails/redirectConfig";
import AlertStatus from "../../AlertStatus";
import "../../Styles/AdminStyles/InventoryStyles.css"

const ManageCategories = ({ userEmail, authIdToken }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editedCategoryValue, setEditedCategoryValue] = useState('');
  const [alert, setAlert] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryDetails, setShowCategoryDetails] = useState(false);

  const fetchCategories = async () => {  
    try {
      const url = `${configDetails.baseUrl}${configDetails.allCategories}`;
      const response = await fetch(url,{
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization':authIdToken
          }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories. Status: ${response.status}`);
      }

      const categoriesData = await response.json();
      // Sort categories alphabetically by name
      const sortedCategories = categoriesData.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(sortedCategories);
    } catch (error) {
      handleAlert("Failed to fetch categories. Please try again later.", "danger");
    }
  };


  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      handleAlert('Please enter a value for the new category.', 'danger');
      return;
    }
    try {
      const url = `${configDetails.baseUrl}${configDetails.addCategory}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':authIdToken
        },
        body: JSON.stringify({ 
          name: newCategory 
        }),
      });

      if (response.ok) {
        setNewCategory('');
        fetchCategories();
        handleAlert('Category added successfully.', 'success');
      } else {
        handleAlert("Category already exists.", "danger");
      }
    } catch (error) {
      handleAlert('Failed to add Category. Please try after sometime.', 'danger');
    }
  };

  const handleUpdateCategory = async () => {
    if (!editedCategoryValue.trim()) {
      handleAlert('Please enter a value for the updated category.', 'danger');
      return;
    }

    try {
      const url = `${configDetails.baseUrl}${configDetails.updateCategory}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':authIdToken
        },
        body: JSON.stringify({ 
          id: editCategoryId, 
          name: editedCategoryValue,
          modifiedBy: userEmail  
        }),
      });

      if (response.ok) {
        setEditCategoryId(null);
        setEditedCategoryValue('');
        fetchCategories();
        handleAlert('Category updated successfully.', 'success');
      } else {
        handleAlert('Failed to update Category. Please try after sometime.', 'danger');
      }
    } catch (error) {
      handleAlert('Failed to update Category. Please try after sometime.', 'danger');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const url = `${configDetails.baseUrl}${configDetails.deleteCategory}/${categoryId}`;
      const response = await fetch(url, {
        method: 'DELETE',
         headers: {
          'Content-Type': 'application/json',
          'Authorization':authIdToken
        }
      });

      if (response.ok) {
        fetchCategories();
        handleAlert('Category deleted successfully.', 'success');
      } else {
        handleAlert("Failed to delete Category.", "danger");
      }
    } catch (error) {
      handleAlert('Failed to delete Category. Please try after sometime.', 'danger');
    }
  };

  const handleClickFetchCategories = () => {
    fetchCategories();
  };

  const handleEditCategory = (categoryId, currentCategoryValue) => {
    setEditCategoryId(categoryId);
    setEditedCategoryValue(currentCategoryValue);
  };


  return (
    <div className="container mt-4">
      <h2 className="text-center">Manage Categories</h2>
      <p><strong>Note:</strong> These Categories are types of HandMade Items</p>
      <div className="row justify-content-center mt-3">
        <button onClick={handleClickFetchCategories} style={{margin:'5px', width:'auto'}} className="btn btn-info mr-2">Fetch Categories</button>
        <div className="form-inline">
          <input
            type="text"
            placeholder="Enter new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="form-control mr-2"
          />
          <button onClick={handleAddCategory} style={{margin:'10px'}} className="btn btn-primary">Add Category</button>
        </div>
      </div>
      <table className="table mt-4">
        <thead className="thead-dark">
          <tr>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.id} className={index % 2 === 0 ? 'table-light' : 'table-blue'}>
              <td>
                {category.id === editCategoryId ? (
                  <input
                    type="text"
                    value={editedCategoryValue}
                    onChange={(e) => setEditedCategoryValue(e.target.value)}
                    className="form-control"
                  />
                ) : (
                  category.name
                )}
              </td>
              <td>
                {category.id === editCategoryId ? (
                  <>
                    <button onClick={handleUpdateCategory} className="btn btn-success mr-2">Save</button>
                    <button onClick={() => setEditCategoryId(null)} className="btn btn-secondary">Cancel</button>
                  </>
                ) : (
                  <>
                    <button style={{marginRight:'20px'}} onClick={() => handleEditCategory(category.id, category.name)} className="btn btn-warning mr-2">Edit</button>
                    <button onClick={() => handleDeleteCategory(category.id)} className="btn btn-danger">Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCategories;
