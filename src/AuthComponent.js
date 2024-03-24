// Example in a component file (e.g., src/components/AuthComponent.js)
import React from 'react';
import { AmplifyAuthenticator, AmplifySignIn, AmplifySignOut } from '@aws-amplify/ui-react';

const AuthComponent = () => (
  <AmplifyAuthenticator>
    <div>
      <h1>Crafty Carnival</h1>
      <AmplifySignIn />
      <AmplifySignOut />
    </div>
  </AmplifyAuthenticator>
);

export default AuthComponent;
