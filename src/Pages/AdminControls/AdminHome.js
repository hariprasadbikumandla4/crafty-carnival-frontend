import React, { useState } from "react";
import AdminProductsPage from "./AdminProductsPage";
import AdminInventoriesPage from "./AdminInventoriesPage";
import AdminOrdersHome from"./AdminOrdersHome"
import AdminUsers from "../../ConfigureDetails/AdminUsers";

const AdminHome = ({ userEmail, authIdToken }) => {
  const [mode, setMode] = useState('adminOrdersPage');

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  const isAllowedUser = AdminUsers.usersList.includes(userEmail);

  return (
    <div style={{ marginLeft: '20px', marginRight: '20px', width: 'auto' }}>
      <h1 style={{ backgroundColor: '#33FF', color: 'white', textAlign: 'center', padding: '5px' }}> Admin Portal</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
        {isAllowedUser && (
          <>
            <button style={{ margin: '2px', width: 'auto', height: '40px' }} onClick={() => handleModeChange('adminOrdersPage')}>
              Manage Orders
            </button>
            <button style={{ margin: '2px', width: 'auto', height: '40px' }} onClick={() => handleModeChange('adminProductsPage')}>
              Manage Products
            </button>
            <button style={{ margin: '2px', width: 'auto', height: '40px' }} onClick={() => handleModeChange('adminInventoriesPage')}>
              Manage Inventories
            </button>
          </>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {mode==='adminOrdersPage' && <AdminOrdersHome userEmail={userEmail } authIdToken={authIdToken}/>}
        {mode==='adminProductsPage' && <AdminProductsPage userEmail={userEmail } authIdToken={authIdToken}/>}
        {mode==='adminInventoriesPage' && <AdminInventoriesPage userEmail={userEmail } authIdToken={authIdToken}/>}
      </div>
    </div>
  );
}

export default AdminHome;
