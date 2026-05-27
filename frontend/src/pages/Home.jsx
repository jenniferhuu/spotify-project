import { useAuth } from "../context/AuthProvider.jsx";
import Navbar from "../components/Navbar";

export default function Home() {
    const { user } = useAuth();

    return (
        <>
            <div className="flex w-full h-screen bg-slate-50 overflow-hidden">
                <Navbar />
                <div className="flex-1 h-full p-8 overflow-y-auto">
                    <h1 className="text-3xl font-extrabold text-black tracking-tight">
                        Welcome back,{" "}
                        <span className="text-[#1F6F5F]">
                            {user.username}
                        </span>{" "}
                    </h1>
                </div>
            </div>
        </>
    );
}
