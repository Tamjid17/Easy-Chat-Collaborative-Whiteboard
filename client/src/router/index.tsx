import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import AuthPage from "@/features/AuthPage";
import ChatPage from "@/features/chat/ChatPage";
import NotFoundPage from "@/features/NotFoundPage";
import { WhiteboardPage } from "@/features/whiteboard/WhiteboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <ChatPage />,
      },
      {
        path: "/whiteboard/:roomId",
        element: <WhiteboardPage />,
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
