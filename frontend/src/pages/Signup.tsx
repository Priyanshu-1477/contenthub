import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/signup", {
        username,
        email,
        password
      });

      // After successful signup, log them in automatically
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const loginResponse = await api.post("/auth/login", formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      login(loginResponse.data.access_token, response.data);
      navigate("/");

    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Create Account</h2>
        {error && <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded mb-4 text-center">{error}</div>}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-gray-200 mb-1" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-200 mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-200 mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 bg-black/20 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disable:opacity-50"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-300 gap-2 flex justify-center">
          Already have an account?
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
