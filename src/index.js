// src/index.js
import React from "react";
import ReactDOM from "react-dom";
import { Amplify } from "aws-amplify";
import awsmobile from "./aws-exports";
import App from "./App";

Amplify.configure(awsmobile);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
