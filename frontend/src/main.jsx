import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import LikedSongs from "./pages/LikedSongs.jsx";
import Login from "./pages/Login.jsx";
import Callback from "./pages/Callback.jsx";

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
                path: "/likedsongs",
                element: <LikedSongs />,
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
