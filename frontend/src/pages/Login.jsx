export default function Login() {
    function handleLogin() {
        // TODO: wire this to the backend OAuth endpoint
        window.location.href = "http://localhost:3000/auth/spotify";
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#1B5E3A] rounded-full flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6Z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-slate-900">
                        App Name
                    </span>
                </div>

                <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">
                    Welcome back
                </h1>

                <p className="text-slate-500 text-center text-sm mb-8">
                    Connect your Spotify to find people
                    <br />
                    who listen like you.
                </p>

                <button
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-[#1B5E3A] hover:bg-[#164D30] text-white font-semibold py-3 px-6 rounded-full transition-colors duration-150 cursor-pointer"
                >
                    <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                    </svg>
                    Continue with Spotify
                </button>

                <div className="border-t border-slate-200 my-6" />

                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
                    What we&apos;ll access
                </p>

                <ul className="space-y-3 mb-6">
                    {[
                        "Your profile, display name & photo",
                        "Your top artists, tracks & genres",
                        "Your currently playing track",
                    ].map((item) => (
                        <li
                            key={item}
                            className="flex items-start gap-3 text-sm text-slate-700"
                        >
                            <svg
                                className="w-5 h-5 text-[#1B5E3A] shrink-0 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            {item}
                        </li>
                    ))}
                </ul>

                <p className="text-xs text-slate-400 text-center">
                    By continuing you agree to our{" "}
                    <a href="/terms" className="underline hover:text-slate-600">Terms</a>
                    {" "}and{" "}
                    <a href="/privacy" className="underline hover:text-slate-600">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
}
