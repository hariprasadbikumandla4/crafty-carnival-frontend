import React, { useEffect } from "react";

const AlertStatus = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  let alertClass = '';
  if (type === 'success') {
    alertClass = 'alert-success';
  } else if (type === 'danger') {
    alertClass = 'alert-danger';
  }

  return (
    <div className={`alert ${alertClass}`} style={{ fontWeight: 'bold', color: type === 'success' ? 'green' : 'red', padding: '5px', fontSize: '0.9rem', position: 'fixed', top: '10px', right: '10px', zIndex: '9999' }} role="alert">
      {message}
    </div>
  );
};

export default AlertStatus;