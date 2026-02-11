"use client";

import { resetPassword } from "@/lib/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ResetPasswordCodePage() {
  const router = useRouter(); // ✅ move here (top level)
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const e = searchParams.get("email");
    if (e) setEmail(e);
  }, [searchParams]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) return toast.error("Email is required");
    if (!/^\d{6}$/.test(code.trim())) return toast.error("Code must be 6 digits");
    if (newPassword.length < 8)
      return toast.error("Password must be at least 8 characters");

    try {
      setLoading(true);

      const res = await resetPassword(email.trim(), code.trim(), newPassword);

      toast.success(res?.message || "Password reset successful");

      router.push("/login");
    } catch (err: any) {
      toast.error(err?.message || "Reset password failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow p-6">
        <h1 className="text-2xl font-semibold">Reset password</h1>
        <p className="text-sm text-gray-600 mt-1">
          Enter the 6-digit code sent to your email.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Reset code</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring tracking-widest text-center"
              type="text"
              inputMode="numeric"
              placeholder="123456"
              value={code}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                setCode(v);
              }}
            />
          </div>

          <div>
            <label className="text-sm font-medium">New password</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
                type={showPass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="rounded-xl border px-3 py-2 text-sm"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-black text-white py-2.5 font-medium disabled:opacity-60"
            type="submit"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          Didn’t get a code?{" "}
          <a className="underline" href="/request-reset-password">
            Resend code
          </a>
        </div>
      </div>
    </div>
  );
}
