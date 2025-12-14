import React from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // optional server logout (e.g., invalidate refresh token)
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include", // if you use cookies
                headers: { "Content-Type": "application/json" },
            }).catch(() => { });
        } finally {
            // clear client-side auth state
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            sessionStorage.clear();

            // If you're using cookies you may need to clear them from server side.
            // Redirect to login
            navigate("/login", { replace: true });

            // Ensure app state reset (optional)
            window.location.reload();
        }
    };

    return (
        <button type="button" onClick={handleLogout} aria-label="Log out">
            Logout
        </button>
    );
}