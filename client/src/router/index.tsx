import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import AuthPage from "@/features/AuthPage";
import ChatPage from "@/features/chat/ChatPage";
import NotFoundPage from "@/features/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <ChatPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
