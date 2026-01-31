import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import GlassCard from "../components/GlassCard";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message))
        return;
      }
      dispatch(signInSuccess(data))
      navigate('/')
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-beige-primary">
      <GlassCard className="p-8 max-w-md w-full animate-fade-in" hover={false}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <input
              type="email"
              placeholder="name@email.com"
              className="modern-input w-full"
              id="email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <Link to="/forgot-password"><span className="text-xs text-purple-600 font-bold hover:underline">Forgot?</span></Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="modern-input w-full"
              id="password"
              onChange={handleChange}
              required
            />
          </div>

          <button
            disabled={loading}
            className="modern-btn w-full py-4 rounded-2xl font-bold text-lg shadow-lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="relative flex items-center gap-4 py-2">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="text-xs font-bold text-slate-400 uppercase">Or continue with</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <OAuth />
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-100">
          <p className="text-slate-600 text-sm">
            Don't have an account?
            <Link to="/sign-up">
              <span className="text-purple-600 font-bold hover:underline ml-1">Create account</span>
            </Link>
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-red-500 text-sm font-medium text-center">{error}</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
