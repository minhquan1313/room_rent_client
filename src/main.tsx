import "@/translations/i18n";

import "@/assets/fonts/SVN-Poppins/SVN-Poppins.css";
import "@/styles/flickityOverwrite.css";
import "@/styles/googleMapOverride.css";
import "@/styles/tailwind.css";
import "antd/dist/reset.css";
import "flickity/css/flickity.css";

import App from "@/App";
import AntDProvider from "@/Contexts/AntDProvider";
import ChatSocketProvider from "@/Contexts/ChatSocketProvider";
import GlobalDataProvider from "@/Contexts/GlobalDataProvider";
import GoogleMapProvider from "@/Contexts/GoogleMapProvider";
import InteractedUserProvider from "@/Contexts/InteractedUserProvider";
import NotificationProvider from "@/Contexts/NotificationProvider";
import SavedProvider from "@/Contexts/SavedProvider";
import ThemeProvider from "@/Contexts/ThemeProvider";
import UserLocationProvider from "@/Contexts/UserLocationProvider";
import UserProvider from "@/Contexts/UserProvider";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <UserProvider>
          <GlobalDataProvider>
            <SavedProvider>
              <GoogleMapProvider>
                <UserLocationProvider>
                  <ChatSocketProvider>
                    <InteractedUserProvider>
                      <NotificationProvider>
                        <AntDProvider>
                          <App />
                        </AntDProvider>
                      </NotificationProvider>
                    </InteractedUserProvider>
                  </ChatSocketProvider>
                </UserLocationProvider>
              </GoogleMapProvider>
            </SavedProvider>
          </GlobalDataProvider>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
