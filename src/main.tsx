import App from "@/App";
import GlobalDataProvider from "@/Contexts/GlobalDataProvider";
import GoogleMapProvider from "@/Contexts/GoogleMapProvider";
import ThemeProvider from "@/Contexts/ThemeProvider";
import UserProvider from "@/Contexts/UserProvider";
import "@/assets/fonts/SVN-Poppins/SVN-Poppins.css";
import "@/styles/flickityOverwrite.css";
import "@/styles/tailwind.css";
import "antd/dist/reset.css";
import "flickity/css/flickity.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <GlobalDataProvider>
          <UserProvider>
            <GoogleMapProvider>
              <App />
            </GoogleMapProvider>
          </UserProvider>
        </GlobalDataProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
