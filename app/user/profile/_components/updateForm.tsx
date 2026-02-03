"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { z } from "zod";
import { handleUpdateProfile } from "@/lib/actions/auth-actions";
import { Pencil } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const updateUserSchema = z.object({
  email: z.string().email("Email is invalid"),
  username: z.string().min(3, { message: "Minimum 3 characters" }),
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "Max file size is 5MB",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .jpeg, .png and .webp formats are supported",
    }),
  phoneNumber: z.string().max(10, "Max 10 digits").optional(),
  location: z.string().optional(),
  DOB: z.string().optional(),
  gender: z.string().optional(),
});

export type UpdateUserData = z.infer<typeof updateUserSchema>;

export default function UpdateUserForm({ user }: { user: any }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: user?.email || "",
      username: user?.username || "",
      phoneNumber: user?.phoneNumber || "",
      location: user?.location || "",
      DOB: user?.DOB || "",
      gender: user?.gender || "",
    },
    mode: "onSubmit",
  });

  const [editing, setEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // When user changes (or on first mount), sync form
    reset({
      email: user?.email || "",
      username: user?.username || "",
      phoneNumber: user?.phoneNumber || "",
      location: user?.location || "",
      DOB: user?.DOB || "",
      gender: user?.gender || "",
    });
  }, [user, reset]);

  const handleImageChange = (
    file: File | undefined,
    onChange: (file: File | undefined) => void
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
    onChange(file);
  };

  const clearImage = (onChange?: (file: File | undefined) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: UpdateUserData) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("username", data.username);
      formData.append("phoneNumber", data.phoneNumber || "");
      formData.append("location", data.location || "");
      formData.append("DOB", data.DOB || "");
      formData.append("gender", data.gender || "");
      if (data.image) formData.append("image", data.image);

      const response = await handleUpdateProfile(formData);

      if (!response?.success) {
        toast.error(response?.message || "Update profile failed");
        return;
      }

      toast.success("Profile updated successfully");
      setEditing(false);
      clearImage();
      // optional: reset dirty state after save
      reset(
        {
          email: data.email,
          username: data.username,
          phoneNumber: data.phoneNumber || "",
          location: data.location || "",
          DOB: data.DOB || "",
          gender: data.gender || "",
        },
        { keepDirty: false }
      );
    } catch (err: any) {
      toast.error(err?.message || "Profile update failed");
    }
  };

  const inputBase =
    "h-11 w-full rounded-xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 px-4 text-sm outline-none focus:border-black/30 dark:focus:border-white/30 disabled:opacity-70 disabled:cursor-not-allowed";

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-3xl bg-white shadow-sm border border-black/5 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-black">
                Personal Information
              </h2>
              <p className="text-sm text-black/50 mt-1">
                Update your personal details and contact information.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="h-11 rounded-full border-2 border-[#35C759] px-4 text-sm font-semibold text-[#35C759] hover:bg-[#35C759]/10 flex items-center gap-2"
              >
                <Pencil size={16} />
                Edit Information
              </button>

              <button
                type="submit"
                form="profile-form"
                disabled={!editing || isSubmitting}
                className="h-11 rounded-full bg-[#35C759] px-6 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          {/* Body */}
          <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="mt-8">
            {/* Avatar + Upload (optional) */}
            <div className="flex items-center gap-5 mb-8">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border border-black/10">
                {previewImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewImage}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : user?.image ? (
                  <Image
                    src={process.env.NEXT_PUBLIC_API_BASE_URL + user.image}
                    alt="Profile"
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-black/5 flex items-center justify-center text-xs text-black/40">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-black">Profile photo</div>

                <div className="flex items-center gap-3">
                  <Controller
                    name="image"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <input
                        ref={fileInputRef}
                        type="file"
                        disabled={!editing}
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={(e) =>
                          handleImageChange(e.target.files?.[0], onChange)
                        }
                        className="text-sm"
                      />
                    )}
                  />

                  <Controller
                    name="image"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <button
                        type="button"
                        disabled={!editing}
                        onClick={() => clearImage(onChange)}
                        className="text-sm font-semibold text-black/60 hover:text-black disabled:opacity-50"
                      >
                        Remove
                      </button>
                    )}
                  />
                </div>

                {errors.image?.message && (
                  <p className="text-xs text-red-600">{errors.image.message}</p>
                )}
              </div>
            </div>

            {/* Grid like screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Username -> Like "First Name" */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-black/80">
                  Username
                </label>
                <input
                  {...register("username")}
                  disabled={!editing}
                  className={inputBase}
                  placeholder="Username"
                />
                {errors.username?.message && (
                  <p className="text-xs text-red-600">{errors.username.message}</p>
                )}
              </div>

              {/* Gender -> Like "Last Name" */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-black/80">
                  Gender
                </label>
                <input
                  {...register("gender")}
                  disabled={!editing}
                  className={inputBase}
                  placeholder="male / female / other"
                />
                {errors.gender?.message && (
                  <p className="text-xs text-red-600">{errors.gender.message}</p>
                )}
              </div>

              {/* Location -> Like "Shipping Address" (full width) */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-black/80">
                  Shipping Address
                </label>
                <input
                  {...register("location")}
                  disabled={!editing}
                  className={inputBase}
                  placeholder="Enter your address"
                />
                {errors.location?.message && (
                  <p className="text-xs text-red-600">{errors.location.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-black/80">
                  Email Address
                </label>
                <input
                  {...register("email")}
                  disabled={!editing}
                  className={inputBase}
                  placeholder="you@example.com"
                />
                {errors.email?.message && (
                  <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-black/80">
                  Phone Number
                </label>
                <input
                  {...register("phoneNumber")}
                  disabled={!editing}
                  className={inputBase}
                  placeholder="(xxx) xxx-xxxx"
                />
                {errors.phoneNumber?.message && (
                  <p className="text-xs text-red-600">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* DOB */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-black/80">
                  Date of Birth
                </label>
                <input
                  type="date"
                  {...register("DOB")}
                  disabled={!editing}
                  className={inputBase}
                />
                {errors.DOB?.message && (
                  <p className="text-xs text-red-600">{errors.DOB.message}</p>
                )}
              </div>
            </div>

            {/* Bottom row like screenshot (optional) */}
            <div className="mt-8 flex items-center justify-end gap-3">
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setPreviewImage(null);
                    reset(undefined, { keepDirty: false });
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="h-11 rounded-full px-5 text-sm font-semibold text-black/70 hover:bg-black/5"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={!editing || isSubmitting || (!isDirty && !previewImage)}
                className="h-11 rounded-full bg-[#35C759] px-6 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
