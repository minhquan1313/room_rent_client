import MyContainer from "@/Components/MyContainer";
import { UserContext } from "@/Contexts/UserContext";
import AddRoom from "@/Pages/AddRoom";
import Home from "@/Pages/Home";
import Login from "@/Pages/Login";
import MyLayout from "@/Pages/MyLayout";
import NotFound from "@/Pages/NotFound";
import Register from "@/Pages/Register";
import { OWNER_ROLES } from "@/config/roleType";
import { pageTitle } from "@/utils/pageTitle";
import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  const { user } = useContext(UserContext);
  pageTitle("");

  return (
    <MyContainer.Raw>
      <Routes>
        <Route path="/" element={<MyLayout />}>
          <Route index element={<Home />} />
          {/* <Route
            path="/trips"
            element={user ? <Home /> : <Navigate to="/login" />}
          /> */}

          <Route
            path="/rooms/add"
            element={
              OWNER_ROLES.includes(user?.role.title) ? (
                <AddRoom />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </MyContainer.Raw>
  );
}

export default App;
