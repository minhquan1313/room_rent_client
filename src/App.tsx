import AddRoomLazy from "@/Components/LazyComponent/AddRoomLazy";
import AllRoomDashBoardLazy from "@/Components/LazyComponent/AllRoomDashBoardLazy";
import BookMarkRoomLazy from "@/Components/LazyComponent/BookMarkRoomLazy";
import ChatLazy from "@/Components/LazyComponent/ChatLazy";
import DashBoardLazy from "@/Components/LazyComponent/DashBoardLazy";
import RoomDetailLazy from "@/Components/LazyComponent/RoomDetailLazy";
import RoomEditLazy from "@/Components/LazyComponent/RoomEditLazy";
import RoomSearchLazy from "@/Components/LazyComponent/RoomSearchLazy";
import RoomServiceCategoriesDashBoardLazy from "@/Components/LazyComponent/RoomServiceCategoriesDashBoardLazy";
import RoomServicesDashBoardLazy from "@/Components/LazyComponent/RoomServicesDashBoardLazy";
import RoomTypesDashBoardLazy from "@/Components/LazyComponent/RoomTypesDashBoardLazy";
import UserDashBoardLazy from "@/Components/LazyComponent/UserDashBoardLazy";
import UserDetailLazy from "@/Components/LazyComponent/UserDetailLazy";
import UserInfoLazy from "@/Components/LazyComponent/UserInfoLazy";
import MyContainer from "@/Components/MyContainer";
import { UserContext } from "@/Contexts/UserProvider";
import LayoutAdmin from "@/Pages/AdminPages/LayoutAdmin";
import Home from "@/Pages/Home";
import Login from "@/Pages/Login";
import MyLayout from "@/Pages/MyLayout";
import NotFound from "@/Pages/NotFound";
import Register from "@/Pages/Register";
import Verify from "@/Pages/Verify";
import { isRoleAdmin, isRoleOwner } from "@/constants/roleType";
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
          <Route
            path={routeAdmin.index}
            element={
              isRoleAdmin(user?.role?.title) ? (
                <LayoutAdmin />
              ) : (
                <Navigate to="/" />
              )
            }
          >
            <Route path={routeAdmin.stats} element={<DashBoardLazy />} />

            <Route path={routeAdmin.user} element={<UserDashBoardLazy />} />

            <Route path={routeAdmin.room}>
              <Route
                path={routeAdmin.roomList}
                element={<AllRoomDashBoardLazy />}
              />
              <Route
                path={routeAdmin.roomType}
                element={<RoomTypesDashBoardLazy />}
              />
              <Route
                path={routeAdmin.roomService}
                element={<RoomServicesDashBoardLazy />}
              />
              <Route
                path={routeAdmin.roomServiceCate}
                element={<RoomServiceCategoriesDashBoardLazy />}
              />
            </Route>

            <Route path={"*"} element={<DashBoardLazy />} />
          </Route>
          {/* Admin routes end */}

          <Route path={routeRoomSearch} element={<RoomSearchLazy />} />
          <Route
            path={routeRoomAdd}
            element={
              isRoleOwner(user?.role?.title) ? (
                <AddRoomLazy />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path={`${routeRoomEdit}/:id`}
            element={
              isRoleOwner(user?.role?.title) ? (
                <RoomEditLazy />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route path={`${routeRoomDetail}/:id`} element={<RoomDetailLazy />} />

          <Route
            path={routeChat}
            element={user ? <ChatLazy /> : <Navigate to="/" />}
          />
          <Route
            path={`${routeChat}/:roomId`}
            element={user ? <ChatLazy /> : <Navigate to="/" />}
          />

          <Route
            path={routeFavoriteRoom}
            element={user ? <BookMarkRoomLazy /> : <Navigate to="/" />}
          />

          <Route path={`${routeUserDetail}/:userId`}>
            <Route index element={<UserDetailLazy />} />

            <Route
              path={routeUpdate}
              element={user ? <UserInfoLazy /> : <Navigate to="/" />}
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </MyContainer.Raw>
  );
}

export default App;
