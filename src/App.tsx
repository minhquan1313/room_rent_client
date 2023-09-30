import MyContainer from "@/Components/MyContainer";
import { UserContext } from "@/Contexts/UserProvider";
import DashBoard from "@/Pages/AdminPages/DashBoard";
import LayoutAdmin from "@/Pages/AdminPages/LayoutAdmin";
import UserDashBoard from "@/Pages/AdminPages/UserDashBoard";
import BookMarkRoom from "@/Pages/BookMarkRoom";
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
import UserEdit from "@/Pages/UserEdit";
import Verify from "@/Pages/Verify";
import { isRoleOwner } from "@/constants/roleType";
import {
  routeAdmin,
  routeChat,
  routeFavoriteRoom,
  routeRoomAdd,
  routeRoomDetail,
  routeRoomEdit,
  routeRoomSearch,
  routeUpdate,
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
        <Route path="/verify" element={<Verify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<MyLayout />}>
          <Route index element={<Home />} />

          {/* Admin routes start */}
          <Route path={routeAdmin.index} element={<LayoutAdmin />}>
            <Route path={routeAdmin.stats} element={<DashBoard />} />

            <Route path={routeAdmin.user} element={<UserDashBoard />} />

            <Route path={"*"} element={<DashBoard />} />
          </Route>
          {/* Admin routes end */}

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

          <Route
            path={routeFavoriteRoom}
            element={user ? <BookMarkRoom /> : <Navigate to="/" />}
          />

          <Route path={`${routeUserDetail}/:userId`}>
            <Route index element={<UserDetail />} />

            <Route
              path={routeUpdate}
              element={user ? <UserEdit /> : <Navigate to="/" />}
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </MyContainer.Raw>
  );
}

export default App;
