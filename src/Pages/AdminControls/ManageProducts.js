import React, { useState, useEffect } from "react";
import configDetails from "../../ConfigureDetails/redirectConfig";
import AddProduct from "./AddProduct";
import EditProduct from "./EdictProduct";
import '../../Styles/AdminStyles/Spinner.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const ManageProducts = ({ authIdToken, userEmail }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [isAddProductPopupOpen, setIsAddProductPopupOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setIsLoading(true);
      const api = `${configDetails.baseUrl}${configDetails.allProducts}`;
      const response = await fetch(api, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authIdToken,
        },
      });
      const productsData = await response.json();
      const sortedProducts = productsData.sort(
        (a, b) => new Date(b.addedOn) - new Date(a.addedOn)
      );
      setAllProducts(sortedProducts);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddProductPopup = () => {
    setIsAddProductPopupOpen(true);
  };

  const closeAddProductPopup = () => {
    fetchAllProducts();
    setIsAddProductPopupOpen(false);
  };

  const openEditProductPopup = (product) => {
    setEditProduct(product);
  };

  const closeEditProductPopup = () => {
    setEditProduct(null);
    fetchAllProducts();
  };

  if (isLoading) {
        return <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p style={{textAlign:'center'}}>Loading Products...</p> 
                </div>;
    }

  if (error) {
    return (
      <div style={{ textAlign: 'center' }}>
        Error: Failed to fetch products, please try again later.
      </div>
    );
  }

  return (
    <div style={{ width: 'calc(100% - 40px)' }}>
      <div style={{ textAlign: "center" }}>
        <h1>Manage Products</h1>
        <button style={{marginRight:'20px'}} className="btn btn-primary mb-3" onClick={fetchAllProducts}>Fetch Products</button>
        <button className="btn btn-success mb-3 ml-3" onClick={openAddProductPopup}>Add New Product</button>
      </div>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th>Item</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Manufacturer</th>
            <th>Price</th>
            <th>Available</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allProducts.map((product, index) => (
            <tr key={product.id}>
              <td><img src={product.imageUrls} width={100} height={100} alt={product.name}></img></td>
              <td>{product.name}</td>
              <td>{product.category}/{product.subcategory}</td>
              <td>{product.manufacturer}</td>
              <td>${product.price}</td>
              <td>{product.quantityAvailable}</td>
              <td>
                <button className="btn btn-primary" onClick={() => openEditProductPopup(product)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isAddProductPopupOpen && <AddProduct onClose={closeAddProductPopup} authIdToken={authIdToken} />}
      {editProduct && <EditProduct product={editProduct} onClose={closeEditProductPopup} authIdToken={authIdToken} />}
    </div>
  );
}

export default ManageProducts;
