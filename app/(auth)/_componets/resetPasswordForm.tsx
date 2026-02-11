"use client";

import { resetPassword } from "@/lib/api/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const e = searchParams.get("email") || "";
    const c = searchParams.get("code") || "";
    setEmail(e);
    setCode(c);
  }, [searchParams]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim()) return toast.error("Email is required");
    if (!/^\d{6}$/.test(code.trim())) return toast.error("Valid 6-digit code is required");
    if (newPassword.length < 8) return toast.error("Password must be at least 8 characters");
    if (newPassword !== confirm) return toast.error("Passwords do not match");

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
    <div className=" flex justify-center  px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow p-6">
        <h1 className="text-2xl font-semibold">Set new password</h1>
        <p className="text-sm text-gray-600 mt-1">
          Create a new password for <span className="font-medium">{email || "your account"}</span>
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
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

          <div>
            <label className="text-sm font-medium">Confirm password</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring"
              type={showPass ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-[#4CAF50] text-white py-2.5 font-medium disabled:opacity-60"
            type="submit"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          Want to re-enter code?{" "}
          <a className="underline" href={`/reset-code-password?email=${encodeURIComponent(email)}`}>
            Back
          </a>
        </div>
      </div>
    </div>
  );
}
