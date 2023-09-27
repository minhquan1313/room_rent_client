import MyContainer from "@/Components/MyContainer";
import { UserContext } from "@/Contexts/UserProvider";
import Chat from "@/Pages/Chat";
import Home from "@/Pages/Home";
import Login from "@/Pages/Login";
import MyLayout from "@/Pages/MyLayout";
import NotFound from "@/Pages/NotFound";
import Register from "@/Pages/Register";
import AddRoom from "@/Pages/RoomAdd";
import RoomDetail from "@/Pages/RoomDetail";
import RoomEdit from "@/Pages/RoomEdit";
import RoomSearch from "@/Pages/RoomSearch";
import UserDetail from "@/Pages/UserDetail";
import { isRoleOwner } from "@/constants/roleType";
import {
  routeChat,
  routeRoomAdd,
  routeRoomDetail,
  routeRoomEdit,
  routeRoomSearch,
  routeUserDetail,
} from "@/constants/route";
import { pageTitle } from "@/utils/pageTitle";
import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
  const { user } = useContext(UserContext);
  pageTitle("");

  return (
    <MyContainer.Raw>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<MyLayout />}>
          <Route index element={<Home />} />

          <Route path={routeRoomSearch} element={<RoomSearch />} />
          <Route
            path={routeRoomAdd}
            element={
              isRoleOwner(user?.role?.title) ? <AddRoom /> : <Navigate to="/" />
            }
          />
          <Route
            path={`${routeRoomEdit}/:id`}
            element={
              isRoleOwner(user?.role?.title) ? (
                <RoomEdit />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route path={`${routeRoomDetail}/:id`} element={<RoomDetail />} />

          <Route
            path={routeChat}
            element={user ? <Chat /> : <Navigate to="/" />}
          />
          <Route
            path={`${routeChat}/:roomId`}
            element={user ? <Chat /> : <Navigate to="/" />}
          />

          <Route path={`${routeUserDetail}/:userId`} element={<UserDetail />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </MyContainer.Raw>
  );
}

export default App;
