import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Amplify, Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import config from './amplifyconfiguration.json';
import '@aws-amplify/ui-react/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import Logo from './Styles/logo.png';

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
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand"  to="/">
            <img src={Logo} width="150" height="100" alt="Crafty Carnival" />
          </Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" style={{marginLeft:'10px', backgroundColor:'aliceblue'}} id="navbarNav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item"><Link className="nav-link" to="/"><strong>Home</strong></Link></li>
              <li className="nav-item"><Link className="nav-link" to="/cart"><strong>Bucket</strong></Link></li>
              <li className="nav-item"><Link className="nav-link" to="/orders"><strong>Orders</strong></Link></li>
              <li className="nav-item"><Link className="nav-link" to="/profile"><strong>Profile</strong></Link></li>
              <li className="nav-item"><Link className="nav-link" to="/contact"><strong>Contact</strong></Link></li>
              <li className="nav-item"><Link className="nav-link" to="/about"><strong>About</strong></Link></li>
              {AdminUsers.usersList.includes(userEmail) && (
                <li className="nav-item"><Link className="nav-link" to="/admin"><strong>Admin</strong></Link></li>
              )}
            </ul>
          </div>
          <div className="d-flex justify-content-end">
              <span className="navbar-text mr-3" style={{marginRight:'10px'}}>
                {userEmail}
              </span>
              <button className="btn btn-outline-danger" style={{marginRight:'10px'}} onClick={signOut}>Sign out</button>
          </div>
        </nav>        
        <div className="container mt-3">
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
