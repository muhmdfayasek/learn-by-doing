import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {} from "./index.css";
import Header from "./components/header";
import App from "./components/App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    
    <Header />
    <App />

  </React.StrictMode>,
);
