"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoginData, loginSchema } from "../schema";
import { Eye, EyeOff } from "lucide-react";
import { handleLogin } from "@/lib/actions/auth-actions";
import { toast } from "react-toastify";

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  });

  const [pending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  /** ✅ Handle submit */
  const submit = async (values: LoginData) => {
    startTransition(async () => {
      try {
        const response = await handleLogin(values);

    if (response?.success !== true) {
      // If backend sends field
      if (response?.field === "email") {
        toast.error("Email is incorrect");
        setError("email", { message: response.message || "Email is incorrect" });
        return;
      }

      if (response?.field === "password") {
        toast.error("Password is incorrect");
        setError("password", {
          message: response.message || "Password is incorrect",
        });
        return;
      }

      return;
    }

    toast.success("Login successfull");
    // redirect...
  
        if (response.data?.role === "admin") {
          router.replace("/admin");
        } else if (response.data?.role === "user") {
          router.replace("/user/dashboard");
        } else {
          router.replace("/");
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong");
      }
    });
  };
const onInvalid = () => {
  toast.error("Please fix the validation errors");
};
  return (
    <form
      onSubmit={handleSubmit(submit, onInvalid)}
      className="space-y-4"
    >
      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="h-10 w-full rounded-md border border-black/10 px-3 text-sm"
          placeholder="you@example.com"
        />
        {errors.email?.message && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="password">
          Password
        </label>

        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="h-10 w-full rounded-md border border-black/10 px-3 text-sm"
            placeholder="••••••"
          />

          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errors.password?.message && (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="h-10 w-full rounded-md bg-[#4CAF50] text-white font-semibold disabled:opacity-60"
      >
        {isSubmitting || pending ? "Logging in..." : "Log in"}
      </button>
      <div className="text-right text-sm">
         <Link href="/request-reset-password" className="font-medium hover:underline ">
          Forgot password?
        </Link>
      </div>
         
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold hover:underline">
          Sign up
        </Link>
      </div>
    </form>
  );
}
function setError(arg0: string, arg1: { message: any; }) {
  throw new Error("Function not implemented.");
}

