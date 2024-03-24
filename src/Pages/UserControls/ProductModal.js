import React, { useState } from 'react';
import '../../Styles/UserPageStyles/ProductModal.css'; 
import NoImage from '../../Styles/noimage.png'

const ProductModal = ({
  product,
  isOpen,
  onClose,
  handleAddToCart,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
  cart
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen) return null;

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.imageUrls.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>X</button>
        <div className="modal-content">
          <div className="image-gallery">
            <button className="arrow left" onClick={previousImage}>&lt;</button>
            <img 
              src={product.imageUrls[currentImageIndex] || {NoImage}}
              alt={`${product.name} image ${currentImageIndex + 1}`}
            />
            <button className="arrow right" onClick={nextImage}>&gt;</button>
          </div>
          <div className="product-details">
            <h3>{product.name}</h3>
            <p><strong>Description:</strong> {product.description} </p> 
            <p>Sold by <strong>{product.manufacturer}</strong></p>
            <p>Price: ${product.price}, Available: <strong>{product.quantityAvailable}</strong></p>
            {cart[product.id] > 0 ? (
              <div className="quantity-controls">
                <button onClick={() => handleDecreaseQuantity(product.id)}>-</button>
                <span>{cart[product.id]}</span>
                <button onClick={() => handleIncreaseQuantity(product.id)}>+</button>
              </div>
            ) : (
              <button onClick={() => handleAddToCart(product.id)}>Add to Cart</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
