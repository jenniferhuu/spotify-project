import { useAuth } from "../context/useAuth.js";
import Navbar from "../components/Navbar";

export default function Home() {
    const { user } = useAuth();

    return (
        <>
            <div className="min-h-screen bg-slate-50 overflow-x-hidden">
                <Navbar />
                <div className="ml-52 min-h-screen p-8">
                    <h1 className="text-3xl font-extrabold text-black tracking-tight">
                        Welcome back,{" "}
                        <span className="text-[#1F6F5F]">
                            {user?.username}
                        </span>{" "}
                    </h1>
                </div>
            </div>
        </>
    );
}
