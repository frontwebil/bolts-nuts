"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function LoginAdminForm() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const session = useSession();

  if (session.data?.user.role == "admin") {
    router.replace("/admin-page-21sQsafaboltsnuts");
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    await signOut({ redirect: false });

    if (!password || !login) {
      toast("All fields are required");
      setLoading(false);
      return;
    }

    const res = await signIn("admin-login", {
      login,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.replace("/admin-page-21sQsafaboltsnuts");
      toast.success("You are logged in!");
    } else {
      if (res?.error === "CredentialsSignin") {
        toast.error("Wrong login or password");
      } else {
        toast.error("Login error");
      }
    }

    setLoading(false);
  };

  return (
    <div className="mt-40 flex items-center justify-center bg-gray-50">
      <form
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg"
        onSubmit={handleLogin}
      >
        <h1 className="mb-1 text-2xl font-bold text-gray-900">Admin Login</h1>
        <p className="mb-6 text-sm text-gray-500">
          Enter your credentials to access the admin panel
        </p>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Login
          </label>
          <input
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-black"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm outline-none transition focus:border-black"
          />
        </div>

        <button
          disabled={loading}
          className="w-full rounded-xl bg-black py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
