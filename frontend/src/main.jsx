import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";
import Home from "./pages/Home.jsx";
import LikedSongs from "./pages/LikedSongs.jsx";
import Login from "./pages/Login.jsx";
import ForumsPage from "./pages/ForumsPage.jsx";
import ThreadsPage from "./pages/ThreadsPage.jsx";
import ThreadDetailPage from "./pages/ThreadDetailPage.jsx";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "/likedsongs",
                element: <LikedSongs />,
            },
            {
                path: "/forums",
                element: <ForumsPage />,
            },
            {
                path: "/forums/:forumId",
                element: <ThreadsPage />,
            },
            {
                path: "/forums/:forumId/threads/:threadId",
                element: <ThreadDetailPage />,
            },
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>,
);
