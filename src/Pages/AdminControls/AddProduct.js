import React, { useEffect, useState } from "react";
import '../../Styles/AdminStyles/AddProduct.css';
import AllCategories from "./AllCategories";
import AllManufacturers from "./AllManufacturers";
import configDetails from "../../ConfigureDetails/redirectConfig";

const AddProduct = ({ onClose, authIdToken }) => {
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productPrice, setProductPrice] = useState(0); 
    const [productQuantity, setProductQuantity] = useState(0);
    const [selectedManufacturer, setSelectedManufacturer] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [allCategories, setAllCategories] = useState([]);
    const [allManufacturers, setAllManufacturers] = useState([]);
    const [productModel, setProductModel] = useState("");
    const [imageUrls, setImageUrls] = useState([]);
    const [imageUrlInput, setImageUrlInput] = useState('');

    useEffect(() => {
        const fetchCateManufacturer = async () => {
            try {
                const categories = await AllCategories(authIdToken);
                const manufacturers = await AllManufacturers(authIdToken);

                setAllCategories(categories);
                setAllManufacturers(manufacturers);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchCateManufacturer();
    }, []);

    const handleAddProduct = async () => {
        try {
            const api = `${configDetails.baseUrl}${configDetails.addProduct}`;
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authIdToken
                },
                body: JSON.stringify({
                    productName: productName,
                    productdescription: productDescription,
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
                console.error('Failed to add product:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handlePriceChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
            setProductPrice(value);
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
                <h2 style={{ backgroundColor: '#6495ED', color: 'white', textAlign: 'center', padding: '5px', marginBottom: '10px', borderRadius: '5px' }}>Add New Product</h2>
                <div>
                    <label>Name:</label>
                    <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
                </div>
                <div>
                    <label>Description:</label>
                    <input type="text" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
                </div>
                <div>
                    <label>Price: ($ enter up to 2 decimal points)</label>
                    <input type="number" step={0.01} value={productPrice} onChange={handlePriceChange} />
                </div>
                <div>
                    <label>Available Count:</label>
                    <input type="number" value={productQuantity} onChange={(e) => setProductQuantity(e.target.value)} />
                </div>
                <div>
                    <label>Select Manufacturer:</label>
                    <select value={selectedManufacturer} onChange={(e) => setSelectedManufacturer(e.target.value)}>
                        <option value="">Select a Manufacturer</option>
                        {allManufacturers.map(manufacturer => (
                            <option key={manufacturer.id} value={manufacturer.manufacturerName}>{manufacturer.manufacturerName}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Select Category:</label>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="">Select a Category</option>
                        {allCategories.map(category => (
                            <option key={category.id} value={category.categoryName}>{category.categoryName}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Product Model:</label>
                    <input type="text" value={productModel} onChange={(e) => setProductModel(e.target.value)} />
                </div>

                <div>
                    <label>Product Image URLs:</label>
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
                                <button onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== index))}>Remove Image</button>
                            </div>
                        ))}
                        <input
                            style={{ marginLeft: '10px', width: '200px' }}
                            type="text"
                            placeholder="Image URL"
                            value={imageUrlInput}
                            onChange={handleImageUrlInputChange}
                        />
                        <button onClick={handleAddImageUrl}>Add Image URL</button>
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <button style={{ margin: '10px', width: '200px', backgroundColor: 'green' }} onClick={handleAddProduct}>Add Product</button>
                    <button style={{ margin: '10px', width: '200px', backgroundColor: 'red' }} onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
