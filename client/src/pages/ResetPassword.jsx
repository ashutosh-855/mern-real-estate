import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import GlassCard from "../components/GlassCard";

export default function ResetPassword() {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`/api/auth/reset-password/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password: formData.password }),
            });
            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
                return;
            }
            setMessage(data.message);
            setTimeout(() => {
                navigate("/sign-in");
            }, 3000);
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-beige-primary">
            <GlassCard className="p-8 max-w-md w-full animate-fade-in" hover={false}>
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Set New Password</h1>
                    <p className="text-slate-500 font-medium">Please choose a strong password you haven't used before.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="modern-input w-full"
                            id="password"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="modern-input w-full"
                            id="confirmPassword"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="modern-btn w-full py-4 rounded-2xl font-bold text-lg shadow-lg"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                        <p className="text-red-500 text-sm font-medium text-center">{error}</p>
                    </div>
                )}
                {message && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-xl">
                        <p className="text-green-600 text-sm font-medium text-center">{message}. Redirecting to login...</p>
                    </div>
                )}
            </GlassCard>
        </div>
    );
}
