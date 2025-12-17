"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "executive" && password === "password") {
      // Mock credentials
      localStorage.setItem("token", "mock-jwt-token-for-executive");
      router.push("/dashboard/sales");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-4">Executive Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="bg-blue-500 text-white p-2 w-full">
        Login
      </button>
    </form>
  );
}
