import React, { useState, useEffect } from "react";
import configDetails from "../../ConfigureDetails/redirectConfig";
import AllCategories from "./AllCategories";
import AllManufacturers from "./AllManufacturers";

const EditProduct = ({ product, onClose, authIdToken }) => {
    const [productName, setProductName] = useState(product.productName);
    const [productDescription, setProductDescription] = useState(product.productDescription);
    const [productPrice, setProductPrice] = useState(product.productPrice);
    const [productQuantity, setProductQuantity] = useState(product.productQuantityAvailable);
    const [selectedManufacturer, setSelectedManufacturer] = useState(product.productManufacturer);
    const [selectedCategory, setSelectedCategory] = useState(product.productCategory);
    const [allCategories, setAllCategories] = useState([]);
    const [allManufacturers, setAllManufacturers] = useState([]);
    const [productModel, setProductModel] = useState(product.productModel);
    const [imageUrls, setImageUrls] = useState(product.imageUrls);
    const [imageUrlInput, setImageUrlInput] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categories = await AllCategories(authIdToken);
                const manufacturers = await AllManufacturers(authIdToken);

                setAllCategories(categories);
                setAllManufacturers(manufacturers);
            } catch (error) {
                console.error("Error fetching data:", error);
                setAllCategories([]);
                setAllManufacturers([]);
            }
        };

        fetchData();
    }, []);

    const handleEditProduct = async () => {
        try {
            const api = `${configDetails.baseUrl}${configDetails.updateProduct}`;
            const response = await fetch(api, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':authIdToken
                },
                body: JSON.stringify({
                    id:product.id,
                    productName: productName,
                    productDescription: productDescription,
                    productPrice: parseFloat(productPrice).toFixed(2),
                    productQuantityAvailable: parseInt(productQuantity), 
                    productManufacturer: selectedManufacturer,
                    productCategory: selectedCategory, 
                    productModel: productModel,
                    imageUrls: imageUrls.filter(url => url.trim() !== "")
                })
            });

            if (response.ok) {
                onClose();
            } else {
                console.error('Failed to edit product:', response.statusText);
            }
        } catch (error) {
            console.error('Error editing product:', error);
        }
    };

    const handleImageUrlInputChange = (e) => {
        setImageUrlInput(e.target.value);
    };

    const handleAddImageUrl = () => {
        if (imageUrlInput.trim() !== '') {
            setImageUrls((prevUrls) => [...prevUrls, imageUrlInput]);
            setImageUrlInput('');
        }
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Edit Product</h2>
                <div>
                    <label>Product Name:</label>
                    <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
                </div>
                <div>
                    <label>Description:</label>
                    <input type="text" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
                </div>
                <div>
                    <label>Price: ($ enter up to 2 decimal points)</label>
                    <input type="number" value={productPrice} 
                        onChange={(e) => setProductPrice(e.target.value)}
                    />
                </div>
                <div>
                    <label>Quantity Available:</label>
                    <input  type="number"
                            min={0}
                            value={productQuantity} 
                            onChange={(e) => {
                                const newValue = parseInt(e.target.value);
                                if (newValue < 0) {
                                    setProductQuantity(0);
                                } else {
                                    setProductQuantity(newValue);
                                }
                            }} 
                    />
                </div>

                <div>
                    <label>Manufacturer:</label>
                    <select value={selectedManufacturer} onChange={(e) => setSelectedManufacturer(e.target.value)}>
                        <option value="">Select a Manufacturer</option>
                        {allManufacturers?allManufacturers.map(manufacturer => (
                            <option key={manufacturer.id} value={manufacturer.manufacturerName}>{manufacturer.manufacturerName}</option>
                        )):"No Manufacturers found."}
                    </select>
                </div>
                <div>
                    <label>Category:</label>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="">Select a Category</option>
                        {allCategories?allCategories.map(category => (
                            <option key={category.id} value={category.categoryName}>{category.categoryName}</option>
                        )):"No Categories found."}
                    </select>
                </div>
                <div>
                    <label>Model:</label>
                    <input type="text" value={productModel} onChange={(e) => setProductModel(e.target.value)} />
                </div>
                <div>
                    <label>Image URLs:</label>
                    <div>
                        {imageUrls.map((url, index) => (
                            <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => {
                                        const newUrls = [...imageUrls];
                                        newUrls[index] = e.target.value;
                                        setImageUrls(newUrls);
                                    }}
                                    style={{ marginRight: '10px' }}
                                />
                                <button onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== index))}>Remove</button>
                            </div>
                        ))}
                        <input
                            style={{ marginLeft: '10px', width: '200px' }}
                            type="text"
                            placeholder="Image URL"
                            value={imageUrlInput}
                            onChange={handleImageUrlInputChange}
                        />
                        <button onClick={handleAddImageUrl}>Add</button>
                    </div>
                </div>
                <div style={{textAlign:'center'}}>
                    <button onClick={handleEditProduct} style={{ margin: '10px', width: '200px', backgroundColor:'green' }}>Save Changes</button>
                    <button onClick={onClose} style={{ margin: '10px', width: '200px', backgroundColor:'red' }}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;
