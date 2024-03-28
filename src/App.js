
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Amplify, Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import config from './amplifyconfiguration.json';
import '@aws-amplify/ui-react/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"
import Logo from './Styles/logo.png'

import AdminHome from './Pages/AdminControls/AdminHome';
import AdminUsers from './ConfigureDetails/AdminUsers';
import Home from './Pages/UserControls/Home';
import Profile from './Pages/UserControls/Profile';
import CartItems from './Pages/UserControls/CartItems';
import OrdersHome from './Pages/UserControls/OrdersHome';
import About from './Pages/UserControls/About';
import Contact from './Pages/UserControls/Contact';

Amplify.configure(config);

function App({ signOut, user }) {
  const [userEmail, setUserEmail] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [authIdToken, setAuthIdToken] = useState(null);
  const [authUserName, setAuthUserName] = useState('');
  const [authPhone, setAuthPhone] = useState('');

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        setUserEmail(user.attributes.email);
        setAuthUserName(user.attributes.name);
        setAuthPhone(user.attributes.phone_number);
        setAuthIdToken(user.signInUserSession.idToken.jwtToken);
        setAuthToken(user.signInUserSession.accessToken.jwtToken);
      })
      .catch(err => {
        console.log(err);
        setUserEmail(null);
      });
  }, []);

  return (
    <Router>
      <div className="container-fluid">
        <div className="header">
          <div className="logo">
            <Link to="/">
              <img src={Logo} width={400} height={150} alt="Crafty Carnival" />
            </Link>
          </div>
          <div>
            <h3 style={{color:'red'}} >This is a Academic Project</h3>
          </div>
          <div className="user-profile">
            <span className="user-email">{userEmail}</span>
            <button className="btn sign-out-btn" onClick={signOut}>Sign out</button>
          </div>
        </div>
        <div className="line"></div>
        <div className="navigation">
          <ul>
            <li><Link to="/"><strong>Home</strong></Link></li>
            <li><Link to="/cart"><strong>Bucket</strong></Link></li>
            <li><Link to="/orders"><strong> Orders</strong></Link></li>
            <li><Link to="/profile"><strong>Profile</strong></Link></li>
            {AdminUsers.usersList.includes(userEmail) && (
              <li><Link to="/admin"><strong>Admin</strong></Link></li>
            )}
            <li><Link to="/contact"><strong> Contact</strong></Link></li>
            <li><Link to="/about"><strong> About</strong></Link></li>
          </ul>
        </div>
        <div className="content">
          <Switch>
            <Route path="/orders">
              <div className="centered-text">
                <OrdersHome authIdToken={authIdToken} userEmail={userEmail} />
              </div>
            </Route>
            <Route path="/profile">
              <div className="centered-text">
                <Profile authIdToken={authIdToken} userEmail={userEmail} authUserName={authUserName} authPhone={authPhone} signOut={signOut}/>
              </div>
            </Route>
            <Route path="/admin">
              {AdminUsers.usersList.includes(userEmail) ? (
                <AdminHome userEmail={userEmail} authIdToken={authIdToken} />
              ) : (
                <div className="centered-text">
                  <p>You don't have access to this page</p>
                </div>
              )}
            </Route>
            <Route path="/cart">
              <div className="centered-text">
                <CartItems authIdToken={authIdToken} userEmail={userEmail} userName={authUserName} userPhone={authPhone}/>
              </div>
            </Route>
            <Route path="/about">
              <div className="centered-text">
                 <About />
              </div>
            </Route>
            <Route path="/contact">
              <div className="centered-text">
                <Contact />
              </div>
            </Route>
            <Route path="/">
              <div className="centered-text">
                <h2>Welcome to Crafty Carnival</h2>
                <Home userEmail={userEmail} authIdToken={authIdToken}/>
              </div>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default withAuthenticator(App);
