import { useState } from "react";
import { Link } from "react-router-dom";
import GlassCard from "../components/GlassCard";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            setMessage(null);
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
                return;
            }
            setMessage(data.message);
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-beige-primary">
            <GlassCard className="p-8 max-w-md w-full animate-fade-in" hover={false}>
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Forgot Password?</h1>
                    <p className="text-slate-500 font-medium">No worries, we'll send you reset instructions.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="name@email.com"
                            className="modern-input w-full"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="modern-btn w-full py-4 rounded-2xl font-bold text-lg shadow-lg"
                    >
                        {loading ? "Sending..." : "Reset Password"}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-slate-100">
                    <p className="text-slate-600 text-sm">
                        Remembered your password?
                        <Link to="/sign-in">
                            <span className="text-purple-600 font-bold hover:underline ml-1">Back to login</span>
                        </Link>
                    </p>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                        <p className="text-red-500 text-sm font-medium text-center">{error}</p>
                    </div>
                )}
                {message && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-xl">
                        <p className="text-green-600 text-sm font-medium text-center">{message}</p>
                    </div>
                )}
            </GlassCard>
        </div>
    );
}
