// pages/Login.jsx
import { useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const signUpWithEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center dark:text-white">Welcome to Todo App</h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <button
          onClick={signInWithGoogle}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition mb-4"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600" />
          <span className="mx-3 text-gray-500 dark:text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600" />
        </div>

        <form onSubmit={signUpWithEmail} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign up with Email"}
          </button>
        </form>
      </div>
    </div>
  );
}
