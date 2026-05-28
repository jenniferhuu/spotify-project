import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider.jsx";

import homeIcon from "../assets/home.png";
import profileIcon from "../assets/profile.png";
import likeIcon from "../assets/heart.png";
import artistIcon from "../assets/mic.png";
import songIcon from "../assets/song.png";
import discoverIcon from "../assets/search.png";
import forumIcon from "../assets/message.png";
import inboxIcon from "../assets/mail.png";
import logoutIcon from "../assets/logout.png";

const links = [
    { to: "/", label: "Home", icon: homeIcon },
    { to: "/profile", label: "Profile", icon: profileIcon },
    { to: "/likedsongs", label: "Liked Songs", icon: likeIcon },
    { to: "/topartists", label: "Top Artists", icon: artistIcon },
    { to: "/topSongs", label: "Top Songs", icon: songIcon },
    { to: "/discover", label: "Discover", icon: discoverIcon },
    { to: "/forums", label: "Forums", icon: forumIcon },
    { to: "/inbox", label: "Inbox", icon: inboxIcon },
];

export default function Navbar() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <aside className="fixed inset-y-0 left-0 z-20 w-52 overflow-y-auto bg-[#1F6F5F] border-r border-slate-200">
            <nav className="flex min-h-screen flex-col items-center px-6 py-4">
                <ul className="flex flex-col gap-5 w-full flex-1">
                    {links.map(({ to, label, icon }) => {
                        const active = pathname === to;
                        return (
                            <li key={to}>
                                <Link
                                    to={to}
                                    className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150
                                        ${
                                            active
                                                ? "bg-white text-slate-950 font-bold shadow-sm"
                                                : "text-white/90 hover:text-white hover:bg-white/10"
                                        }`}
                                >
                                    <img
                                        src={icon}
                                        alt={`${label} icon`}
                                        className={`w-5 h-5 object-contain ${active ? "" : "brightness-0 invert"}`}
                                    />
                                    {label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 w-full rounded-md text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-150"
                >
                    <img
                        src={logoutIcon}
                        alt="Logout icon"
                        className="w-5 h-5 object-contain brightness-0 invert"
                    />
                    Logout
                </button>
            </nav>
        </aside>
    );
}
