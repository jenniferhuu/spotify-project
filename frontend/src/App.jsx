import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthProvider.jsx";
import "./App.css";

function App() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <main>
                <Outlet />
            </main>
        </>
    );
}

export default App;
