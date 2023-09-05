import { UserContext } from "@/Contexts/UserContext";
import Home from "@/Pages/Home";
import MyLayout from "@/Pages/Layout";
import Login from "@/Pages/Login";
import NotFound from "@/Pages/NotFound";
import Register from "@/Pages/Register";
import { pageTitle } from "@/utils/pageTitle";
import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  const { user } = useContext(UserContext);
  pageTitle("");

  return (
    <Routes>
      <Route
        path="/"
        element={<MyLayout />}>
        <Route
          index
          element={<Home />}
        />
        <Route
          path="/trips"
          element={user ? <Home /> : <Navigate to="/login" />}
        />
      </Route>

      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}

export default App;
