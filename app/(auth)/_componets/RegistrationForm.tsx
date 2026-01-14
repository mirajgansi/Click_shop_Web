"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RegisterData, registerSchema } from "../schema";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
        mode: "onSubmit",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [pending, setTransition] = useTransition()

    const submit = async (values: RegisterData) => {
        setTransition( async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            router.push("/login");
        })
        // GO TO LOGIN PAGE
        console.log("register", values);
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="name">Full name</label>
                <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                    {...register("name")}
                    placeholder="Jane Doe"
                />
                {errors.name?.message && (
                    <p className="text-xs text-red-600">{errors.name.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                    {...register("email")}
                    placeholder="you@example.com"
                />
                {errors.email?.message && (
                    <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="password">Password</label>
                <div className="relative">
                <input
                    id="password"
                    type={  showPassword ? "text" : "password" }
                    autoComplete="current-password"
                    className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                    {...register("password")}
                    placeholder="••••••"
                />
                 <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide Password" : "Show Password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            
          </button>
           </div>
                {errors.password?.message && (
                    <p className="text-xs text-red-600">{errors.password.message}</p>
                )}
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="confirmPassword">Confirm password</label>
                <div className="relative">
                <input
                    id="confirmPassword"
                    type={  showPassword ? "text" : "password" }
                    autoComplete="current-password"
                    className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
                    {...register("confirmPassword")}
                    placeholder="••••••"
                />
                 <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            aria-label={showConfirmPassword ? "Hide Password" : "Show Password"}
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
                className="h-10 w-full rounded-md bg-[#4CAF50] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-60"
            >
                { isSubmitting || pending ? "Creating account..." : "Create account"}
            </button>

            <div className="mt-1 text-center text-sm">
                Already have an account? <Link href="/login" className="font-semibold hover:underline">Log in</Link>
            </div>
        </form>
    );
}