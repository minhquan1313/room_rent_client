import App from "@/App";
import GlobalDataProvider from "@/Contexts/GlobalDataProvider";
import GoogleMapProvider from "@/Contexts/GoogleMapProvider";
import RoomProvider from "@/Contexts/RoomProvider";
import ThemeProvider from "@/Contexts/ThemeProvider";
import UserLocationProvider from "@/Contexts/UserLocationProvider";
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
          <RoomProvider>
            <UserProvider>
              <UserLocationProvider>
                <GoogleMapProvider>
                  <App />
                </GoogleMapProvider>
              </UserLocationProvider>
            </UserProvider>
          </RoomProvider>
        </GlobalDataProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
