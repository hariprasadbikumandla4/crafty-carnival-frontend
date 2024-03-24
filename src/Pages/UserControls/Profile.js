import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import '../../Styles/UserPageStyles/Profile.css';
import getAllUserAddresses from './AllUserAddresses';
import AddAddress from './AddAddress';
import UpdateAddress from './UpdateAddress';
import configDetails from '../../ConfigureDetails/redirectConfig';

const ProfileTabs = {
  DETAILS: 'Details',
  ADDRESSES: 'Addresses',
  CHANGE_PASSWORD: 'Change Password',
};

const Profile = ({ userEmail, authUserName, authPhone, authIdToken, signOut }) => {
  const [allAddresses, setAllAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState(ProfileTabs.DETAILS);
  const [isAddAddressPopupOpen, setIsAddAddressPopupOpen] = useState(false);
  const [isUpdateAddressPopupOpen, setIsUpdateAddressPopupOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState(authUserName);
  const [phone, setPhone] = useState(authPhone);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    if (userEmail) {
      fetchUserAddresses();
    }
  }, [userEmail]);

  const fetchUserAddresses = async () => {
    setIsLoading(true);
    try {
      const addresses = await getAllUserAddresses(userEmail, authIdToken);
      setAllAddresses(addresses);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await fetch(`${configDetails.baseUrl}${configDetails.deleteAddress}/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authIdToken,
        },
      });

      if (response.ok) {
        fetchUserAddresses(); // Refresh the addresses list
        console.log("Address deleted successfully.");
      } else {
        console.error("Failed to delete address:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const closeAddAddressPopup = () => {
    setIsAddAddressPopupOpen(false);
    fetchUserAddresses(); // Refresh the addresses list after closing the popup
  };

  const closeUpdateAddressPopup = () => {
    setIsUpdateAddressPopupOpen(false);
    fetchUserAddresses(); // Refresh the addresses list after closing the popup
  };

  const openAddAddressPopup = () => {
    setIsAddAddressPopupOpen(true);
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address); // Assuming you have a state to hold the currently selected address for editing
    setIsUpdateAddressPopupOpen(true); // And another state to control the visibility of the edit address popup/modal
  };

  const handleSave = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, {
        'name': name,
        'phone_number': phone, // Ensure the phone number is in E.164 format
      });
      alert('Profile updated successfully!');
      setIsEditing(false); // Turn off editing mode after successful save
    } catch (error) {
      console.error('Error updating profile: ', error);
      alert('Failed to update profile.');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert("New passwords don't match.");
      return;
    }
    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(user, currentPassword, newPassword);
      alert('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Error changing password: ', error);
      alert('Failed to change password.');
    }
  };

  return (
    <div className="profile-container">
      <h2>Welcome, {authUserName}</h2>
      <div className="tab-controls">
        {Object.values(ProfileTabs).map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === ProfileTabs.DETAILS && (
          <div className="profile-details">
            {isEditing ? (
              <>
                <div>
                  <label htmlFor="name">Name:</label>
                  <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="phone">Phone:</label>
                  <input id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            ) : (
              <>
                <p><strong>Email:</strong> {userEmail}</p>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Phone:</strong> {phone}</p>
                <button onClick={() => setIsEditing(true)}>Edit</button>
              </>
            )}
          </div>
        )}

        {activeTab === ProfileTabs.CHANGE_PASSWORD && (
          <div className="change-password">
            <div>
                            <label htmlFor="currentPassword">Current Password:</label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="newPassword">New Password:</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmNewPassword">Confirm New Password:</label>
              <input
                id="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
            <button onClick={handleChangePassword}>Change Password</button>
          </div>
        )}

        {activeTab === ProfileTabs.ADDRESSES && (
          <div className="addresses-container">
            <button className="add-address-btn" onClick={openAddAddressPopup}>Add New Address</button>
            {isLoading ? (
              <p>Loading addresses...</p>
            ) : allAddresses.length > 0 ? (
              allAddresses.map((address, index) => (
                <div className="address-card" key={index}>
                  <div className="address-content">
                    <strong>Address {index + 1}:</strong> <br />
                    {address.name}, {address.address1}, {address.address2}<br />
                    {address.city}, {address.state}, {address.zip}<br />
                    <strong>Phone:</strong> {address.phone}<br />
                  </div>
                  <div className="address-actions">
                    <button onClick={() => handleEditAddress(address)}>Edit</button>
                    <button onClick={() => handleDeleteAddress(address.id)}>Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No addresses found.</p>
            )}
          </div>
        )}
      </div>

      {isAddAddressPopupOpen && <AddAddress authIdToken={authIdToken} userEmail={userEmail} onClose={closeAddAddressPopup} />}
      {isUpdateAddressPopupOpen && <UpdateAddress authIdToken={authIdToken} userEmail={userEmail} address={selectedAddress} onClose={closeUpdateAddressPopup} />}
      <button style={{ margin: '10px' }} className="btn sign-out-btn" onClick={signOut}>Sign out</button>
    </div>
  );
};

export default Profile;

