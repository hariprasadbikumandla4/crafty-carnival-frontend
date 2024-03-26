import React, { useEffect, useState } from 'react';
import '../../Styles/UserPageStyles/ProductsHome.css';
import configDetails from '../../ConfigureDetails/redirectConfig';
import '../../Styles/AdminStyles/Spinner.css'
import ProductModal from './ProductModal';
import NoImage from '../../Styles/noimage.png'

const Home = ({ userEmail, authIdToken }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [manufacturers, setManufacturers] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState([]);
  const [cart, setCart] = useState({});
  const [existingCart, setExistingCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);

      const productsApi = `${configDetails.baseUrl}${configDetails.allProducts}`;
      const productsResponse = await fetch(productsApi, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          'Authorization':authIdToken
        }
      });
      if (productsResponse.ok) {
        const fetchedProducts = await productsResponse.json();
        setProducts(fetchedProducts);

        const categoryObj = {};
        const manufacturerObj = {};
        fetchedProducts.forEach((product) => {
          categoryObj[product.productCategory] = true;
          manufacturerObj[product.productManufacturer] = true;
        });
        setCategories(categoryObj);
        setManufacturers(manufacturerObj);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCartItems = async (userEmail) => {
    try {
      setIsLoading(true);

      const cartItemsApi = `${configDetails.baseUrl}${configDetails.getUserCartItems}?email=${userEmail}`;
      const cartItemsResponse = await fetch(cartItemsApi, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          'Authorization':authIdToken
        }
      });
      if (cartItemsResponse.ok) {
        const fetchedExistingCart = await cartItemsResponse.json();
        setExistingCart(fetchedExistingCart);
        updateCartLocally(fetchedExistingCart);
      } else {
        console.error('Failed to fetch existing cart items');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // This effect does not depend on userEmail, so it only runs once on component mount
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (userEmail) {
      fetchCartItems(userEmail);
    }
    // This effect depends on userEmail, so it runs on mount and whenever userEmail changes
  }, [userEmail]);

  const showProductDetails = (product) => {
    setSelectedProduct(product);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
  };


  const updateCartLocally = (fetchedExistingCart) => {
    const updatedCart = {};
    fetchedExistingCart.forEach((item) => {
      updatedCart[item.product.id] = item.quantity;
    });
    setCart(updatedCart);
  };

  const addToCart = async (productId, quantity, up) => {
    try {
      setIsUpdatingCart(true); 
      
      const product = products.find((product) => product.id === productId);
      
      if (product && product.productQuantityAvailable < quantity) {
        alert(`${product.productQuantityAvailable} in stock.`);
        return; 
      }
      
      const api = `${configDetails.baseUrl}${configDetails.addItemToCart}?id=${productId}&email=${userEmail}&quantity=${quantity}`;
      const response = await fetch(api, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':authIdToken
        }
      });
      if (response.ok) {
        console.log('Item added to cart successfully');
        const updatedCart = [...existingCart];
        const existingCartItemIndex = updatedCart.findIndex((item) => item.product.id === productId);
        if (existingCartItemIndex !== -1) {
          updatedCart[existingCartItemIndex].quantity += up;
        } else {
          updatedCart.push({ product: products.find((product) => product.id === productId), quantity });
        }
        setExistingCart(updatedCart);

        setCart((prevCart) => ({
          ...prevCart,
          [productId]: quantity
        }));
        
      } else {
        console.error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsUpdatingCart(false); 
    }
  };

  const handleAddToCart = (productId) => {
    const newQuantity = (cart[productId] || 0) + 1;
    addToCart(productId, newQuantity);
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: newQuantity
    }));
  };

  const handleIncreaseQuantity = (productId) => {
    const newQuantity = (cart[productId] || 0) + 1;
    let incre = 1;
    addToCart(productId, newQuantity, incre);
  };

  const handleDecreaseQuantity = (productId) => {
    if (cart[productId] > 1) {
      const newQuantity = cart[productId] - 1;
      let decre = -1;
      addToCart(productId, newQuantity, decre);
      setCart((prevCart) => ({
        ...prevCart,
        [productId]: newQuantity
      }));
    } else if (cart[productId] === 1) {
      addToCart(productId, 0);
      const updatedCart = { ...cart };
      delete updatedCart[productId];
      setCart(updatedCart);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const getFilteredProducts = () => {
    return products.filter((product) => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.productCategory);
      const manufacturerMatch = selectedManufacturers.length === 0 || selectedManufacturers.includes(product.productManufacturer);
      return categoryMatch && manufacturerMatch;
    });
  };

  useEffect(() => {
      fetchProducts();
  }, []); 

  const handleManufacturerChange = (manufacturer) => {
    setSelectedManufacturers((prev) =>
      prev.includes(manufacturer) ? prev.filter((man) => man !== manufacturer) : [...prev, manufacturer]
    );
  };

  if (isLoading) {
    return <div className="loading-container">
              <div className="loading-spinner"></div>
              <p style={{textAlign:'center'}}>Loading Products...</p> 
            </div>;
  }

  return (
    <div className="main-container" style={{ display: 'flex' }}>
      <aside className="filters" style={{ width: '15%', backgroundColor: 'lightgrey', padding: '10px', borderRadius: '10px' }}>
        <button onClick={fetchProducts} style={{width:'100%', marginBottom: '10px'}}>Fetch Products</button>
        <div style={{border: '1px solid', padding: '10px', borderRadius: '5px', margin:'5px' }}>
            <strong>By Categories</strong>
            {Object.keys(categories).map((category) => (
              <div key={category} style={{ display: 'inline-block', marginRight: '10px' }}>
                <input
                  type="checkbox"
                  id={`cat-${category}`}
                  checked={selectedCategories.includes(category)}
                  onChange={() => setSelectedCategories((prev) =>
                    prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category])}
                />
                <label htmlFor={`cat-${category}`}>{category}</label>
              </div>
            ))}
          </div>
        <div style={{border: '1px solid', padding: '10px', borderRadius: '5px' }}>
          <strong> By Manufacturers</strong>
          {Object.keys(manufacturers).map((manufacturer) => (
            <div key={manufacturer}>
              <input
                type="checkbox"
                id={`man-${manufacturer}`}
                checked={selectedManufacturers.includes(manufacturer)}
                onChange={() => handleManufacturerChange(manufacturer)}
              />
              <label htmlFor={`man-${manufacturer}`}>{manufacturer}</label>
            </div>
          ))}
        </div>
      </aside>

      <div className="product-container" style={{ flex: 1, padding: '20px', margin: '0 20px' }}>
      {/* Use a variable to hold the filtered products to avoid calling getFilteredProducts multiple times */}
      {(() => {
        const filteredProducts = getFilteredProducts();
        if (filteredProducts.length === 0) {
          // Display "No Products Found" message if no products are available after filtering
          return <div style={{textAlign:'center'}}>No Products Found.</div>;
        } else {
          // Display products
          return filteredProducts.map((product, index) => (
            <div key={index} className="product-item" style={{ marginBottom: '20px' }}>
              {/* Check if product has imageUrls, otherwise display NoImage */}
              <img
                src={product.imageUrls?product.imageUrls: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'}
                alt={product.productName}
                style={{ width: '200px', height: '200px' }}
              />
              <h3 onClick={() => showProductDetails(product)} style={{ cursor: 'pointer' }}>
                {product.productName}
              </h3>
              <p>Price: ${product.productPrice}</p>
              {cart[product.id] > 0 ? (
                <div className="quantity-controls">
                  <button className="small-button" onClick={() => handleDecreaseQuantity(product.id)}>-</button>
                  <span>{cart[product.id]}</span>
                  <button className="small-button" onClick={() => handleIncreaseQuantity(product.id)}>+</button>
                </div>
              ) : (
                <button className="add-to-cart-button" onClick={() => handleAddToCart(product.id)}>Add to Cart</button>
              )}
            </div>
          ));
        }
      })()}
    </div>

      <ProductModal
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={closeProductDetails}
        handleAddToCart={handleAddToCart}
        handleIncreaseQuantity={handleIncreaseQuantity}
        handleDecreaseQuantity={handleDecreaseQuantity}
        cart={cart}
      />

    </div>
  );
};

export default Home;