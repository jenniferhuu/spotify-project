import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import LikedSongs from "./pages/LikedSongs.jsx";
import TopSongs from "./pages/topSongs.jsx";
import Discover from "./pages/Discover.jsx";
import Login from "./pages/Login.jsx";
import Callback from "./pages/Callback.jsx";
import TopArtistsPage from "./pages/TopArtistsPage.jsx";
import ForumsPage from "./pages/ForumsPage.jsx";
import ThreadsPage from "./pages/ThreadsPage.jsx";
import ThreadDetailPage from "./pages/ThreadDetailPage.jsx";

import { AuthProvider } from "./context/AuthProvider.jsx";

const router = createBrowserRouter([
    {
        path: "/spotify/callback",
        element: <Callback />,
    },
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
                path: "/profile",
                element: <UserProfilePage />,
            },
            {
                path: "/likedsongs",
                element: <LikedSongs />,
            },
            {
                path: "/topSongs",
                element: <TopSongs />,
            },
            {
                path: "/discover",
                element: <Discover />,
            },
            {
                path: "/topartists",
                element: <TopArtistsPage />,
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
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>,
);
