import { createBrowserRouter } from "react-router-dom";
import SignIn from "../components/signin/Signin.jsx";
import Page404 from "../components/error_page/Error404.jsx";
import MiniDrawer from "../components/dashboard/Dashboard.jsx";
import Home from "../components/general_pages/home/Home.jsx";
import Receipts from "../components/general_pages/receipts/Receipts.jsx";
import Tasks from "../components/general_pages/tasks/Tasks.jsx";
import Leadership from "../components/general_pages/leadership/Leadership.jsx";
import Chat from "../components/general_pages/chat/Chat.jsx";
import ChatPage from "../components/general_pages/chat/ChatPage.jsx";
import ProfilePage from "../components/general_pages/profile_pages/ProfilePage.jsx";
import ChangePassword from "../components/general_pages/profile_pages/ChangePasswordPage.jsx";
import { checkAdmin, checkAuthLoader, checkVerified } from "./auth.js";
import User from "../components/admin_pages/admins/Admin.jsx";
import CreateTask from "../components/general_pages/tasks/CreateTask.jsx";
import EditTask from "../components/general_pages/tasks/EditTask.jsx";
import ViewTask from "../components/general_pages/tasks/ViewTask.jsx";

const router = createBrowserRouter([
  {
    path: "login",
    element: <SignIn />,
    errorElement: <Page404 />,
  },
  {
    path: "/",
    element: <MiniDrawer />,
    loader: checkAuthLoader,
    id: "root",
    children: [
      {
        path: "",
        element: <Home />,
        loader: checkVerified,
      },
      {
        path: "receipts",
        element: <Receipts />,
        loader: checkVerified,
      },
      {
        path: "tasks",
        element: <Tasks />,
        loader: checkVerified,
      },
      {
        path: "createTask",
        element: <CreateTask />,
        loader: checkVerified,
      },
      {
        path: "editTask/:taskId",
        element: <EditTask />,
        loader: checkVerified,
      },
      {
        path: "viewTask/:taskId",
        element: <ViewTask />,
        loader: checkVerified,
      },
      {
        path: "leadership",
        element: <Leadership />,
        loader: checkVerified,
      },
      {
        path: "chat",
        element: <Chat />,
        loader: checkVerified,
      },
      {
        path: "chat/:email",
        element: <ChatPage />,
        loader: checkVerified,
      },
      {
        path: "users",
        element: <User />,
        loader: checkAdmin,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "passwordChange",
        element: <ChangePassword />,
      },
    ],
    errorElement: <Page404 />,
  },
]);

export default router;
