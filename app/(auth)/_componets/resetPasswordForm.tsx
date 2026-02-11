"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleResetPassword } from "@/lib/actions/auth-actions";

export const ResetPasswordSchema = z
  .object({
    email: z.string().email("Invalid email"),
    code: z.string().regex(/^\d{6}$/, "Code must be 6 digits"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordForm({
  initialEmail = "",
}: {
  initialEmail?: string;
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordDTO>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: initialEmail,
    },
  });

  const onSubmit = async (data: ResetPasswordDTO) => {
    try {
      const response = await handleResetPassword(
        data.email,
        data.code,
        data.password
      );

      if (response.success) {
        toast.success(response.message || "Password reset successfully");
        router.replace("/login");
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch (error: any) {
      toast.error(error?.message || "An unexpected error occurred");
    }
  };

  return (
    <div>
      <form className="max-w-md" onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Code */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="code">
            Reset Code
          </label>
          <input
            type="text"
            inputMode="numeric"
            id="code"
            {...register("code")}
            className="w-full border border-gray-300 p-2 rounded tracking-widest text-center"
            placeholder="123456"
            onChange={(e) => {
              // keep only digits & max 6
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6);
              register("code").onChange(e);
            }}
          />
          {errors.code && (
            <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            New Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm password */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="confirmPassword"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword")}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <Link
            href="/login"
            className="text-sm text-black hover:underline mb-4 inline-block"
          >
            Back to Login
          </Link>
          <Link
            href="/request-password-reset"
            className="text-sm text-black hover:underline mb-4 inline-block ml-4"
          >
            Request another reset email
          </Link>
        </div>

        <button
          type="submit"
          className="h-10 w-full rounded-md bg-[#4CAF50] text-white font-semibold disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
