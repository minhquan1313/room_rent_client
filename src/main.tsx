import App from "@/App";
import ThemeProvider from "@/Contexts/ThemeProvider";
import UserProvider from "@/Contexts/UserContext";
import "@/assets/fonts/SVN-Poppins/SVN-Poppins.css";
import "@/styles/tailwind.css";
import "antd/dist/reset.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
