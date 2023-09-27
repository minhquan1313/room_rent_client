import App from "@/App";
import ChatSocketProvider from "@/Contexts/ChatSocketProvider";
import GlobalDataProvider from "@/Contexts/GlobalDataProvider";
import GoogleMapProvider from "@/Contexts/GoogleMapProvider";
import InteractedUserProvider from "@/Contexts/InteractedUserProvider";
import NotificationProvider from "@/Contexts/NotificationProvider";
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
          <UserProvider>
            <GoogleMapProvider>
              <UserLocationProvider>
                <ChatSocketProvider>
                  <InteractedUserProvider>
                    <NotificationProvider>
                      <App />
                    </NotificationProvider>
                  </InteractedUserProvider>
                </ChatSocketProvider>
              </UserLocationProvider>
            </GoogleMapProvider>
          </UserProvider>
        </GlobalDataProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
