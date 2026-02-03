"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { handleCreateProduct } from "@/lib/actions/product-action";
import { ProductData, ProductSchema } from "../schema";

type ActionResponse =
  | { success: true; message?: string; data?: any }
  | { success: false; message?: string; issues?: any };

function getErrorMessage(err: unknown, fallback = "Create product failed") {
  if (!err) return fallback;

  // Native Error
  if (err instanceof Error) return err.message || fallback;

  // Common server shapes
  if (typeof err === "object") {
    const anyErr = err as any;
    if (typeof anyErr.message === "string" && anyErr.message.trim()) return anyErr.message;

    // Sometimes backend sends { issues: [...] }
    if (Array.isArray(anyErr.issues) && anyErr.issues.length) {
      // try to format first issue
      const first = anyErr.issues[0];
      const path = Array.isArray(first.path) ? first.path.join(".") : "";
      const msg = first.message || "Invalid input";
      return path ? `${path}: ${msg}` : msg;
    }
  }

  if (typeof err === "string") return err;
  return fallback;
}

function normalizeActionResponse(res: any): ActionResponse {
  // if action returned nothing
  if (!res) return { success: false, message: "No response from server" };

  // already correct shape
  if (typeof res.success === "boolean") return res as ActionResponse;

  // unexpected shape
  return { success: false, message: "Unexpected server response" };
}

export default function CreateProductForm() {
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductData>({
    resolver: zodResolver(ProductSchema),
    mode: "onSubmit",
  });

  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearImage = (onChange?: (file: File | undefined) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
   const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
        setPreviewImage(null);
        onChange?.(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
  const handleImageChange = (
    file: File | undefined,
    onChange: (file: File | undefined) => void
  ) => {
    setError(null);

    // If user cleared the picker
    if (!file) {
      setPreviewImage(null);
      onChange(undefined);
      return;
    }

    // // Basic client-side safety checks (even if zod handles it)
    // const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    // const max = 5 * 1024 * 1024;

    // if (!allowed.includes(file.type)) {
    //   setPreviewImage(null);
    //   onChange(undefined);
    //   if (fileInputRef.current) fileInputRef.current.value = "";
    //   toast.error("Only JPG, PNG, WEBP images are allowed");
    //   return;
    // }

    // if (file.size > max) {
    //   setPreviewImage(null);
    //   onChange(undefined);
    //   if (fileInputRef.current) fileInputRef.current.value = "";
    //   toast.error("Max image size is 5MB");
    //   return;
    // }

    // Preview
    try {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.onerror = () => {
        setPreviewImage(null);
        toast.error("Failed to read image file");
      };
      reader.readAsDataURL(file);

      onChange(file);
    } catch (e) {
      setPreviewImage(null);
      onChange(undefined);
      toast.error("Failed to preview image");
    }
  };

  const onSubmit: SubmitHandler<ProductData> = async (data) => {
    setError(null);

    // prevent double submit edge-cases
    if (pending || isSubmitting) return;

    startTransition(async () => {
      try {
        const formData = new FormData();

        // Required fields
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", String(data.price));
        formData.append("manufacturer", data.manufacturer);
        formData.append("manufactureDate", data.manufactureDate);
        formData.append("expireDate", data.expireDate);
        formData.append("nutritionalInfo", data.nutritionalInfo);
        formData.append("category", data.category);
        // Optional fields (but still send safe defaults)
        formData.append("available", String(data.available ?? true));
        formData.append("inStock", String(data.inStock ?? 0));
        if (data.image) { formData.append('image', data.image);}
        if (data.sku?.trim()) formData.append("sku", data.sku.trim());
 
        const raw = await handleCreateProduct(formData);
        const response = normalizeActionResponse(raw);

        if (!response.success) {
          // if backend returns issues, prefer them
          const msg =
            response.message ||
            (Array.isArray((response as any).issues) ? "Invalid input" : "Create product failed");
          throw new Error(msg);
        }

        reset();
        clearImage();
        toast.success(response.message || "Product created successfully");
      } catch (err) {
        const msg = getErrorMessage(err);
        setError(msg);
        toast.error(msg);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Image preview */}
      {/* <div className="mb-4">
        {previewImage ? (
          <div className="relative w-32 h-32">
            <img
              src={previewImage}
              alt="Product Preview"
              className="w-32 h-32 rounded-md object-cover border"
              onError={() => {
                setPreviewImage(null);
                toast.error("Image preview failed to load");
              }}
            />
            <Controller
              name="image"
              control={control}
              render={({ field: { onChange } }) => (
                <button
                  type="button"
                  onClick={() => clearImage(onChange)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ✕
                </button>
              )}
            />
          </div>
        ) : (
          <div className="w-32 h-32 bg-gray-200 rounded-md flex items-center justify-center border">
            <span className="text-gray-600 text-sm">No Image</span>
          </div>
        )}
      </div> */}

      {/* Image input */}
     <div className="mb-4">
                {previewImage ? (
                    <div className="relative w-24 h-24">
                        <img
                            src={previewImage}
                            alt="Profile Image Preview"
                            className="w-24 h-24 rounded-full object-cover"
                        />
                        <Controller
                            name="image"
                            control={control}
                            render={({ field: { onChange } }) => (
                                <button
                                    type="button"
                                    onClick={() => handleDismissImage(onChange)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            )}
                        />
                    </div>
                ) : (
                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600">No Image</span>
                    </div>
                )}

            </div>
            {/* Profile Image Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Profile Image</label>
                <Controller
                    name="image"
                    control={control}
                    render={({ field: { onChange } }) => (
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                            accept=".jpg,.jpeg,.png,.webp"
                        />
                    )}
                />
                {errors.image && <p className="text-sm text-red-600">{errors.image.message}</p>}
            </div>

      {/* Name */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="name">
          Product Name
        </label>
        <input
          id="name"
          type="text"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          {...register("name")}
          placeholder="e.g. Organic Honey"
        />
        {errors.name?.message && <p className="text-xs text-red-600">{errors.name.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          className="min-h-[90px] w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
          {...register("description")}
          placeholder="Write product details..."
        />
        {errors.description?.message && (
          <p className="text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Price + Stock */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="price">
            Price
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
            {...register("price", { valueAsNumber: true })}
            placeholder="e.g. 250"
          />
          {errors.price?.message && <p className="text-xs text-red-600">{errors.price.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="inStock">
            In Stock
          </label>
          <input
            id="inStock"
            type="number"
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
            {...register("inStock", { valueAsNumber: true })}
            placeholder="e.g. 10"
          />
          {errors.inStock?.message && (
            <p className="text-xs text-red-600">{errors.inStock.message}</p>
          )}
        </div>
      </div>

      {/* Manufacturer */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="manufacturer">
          Manufacturer
        </label>
        <input
          id="manufacturer"
          type="text"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          {...register("manufacturer")}
          placeholder="e.g. ABC Foods"
        />
        {errors.manufacturer?.message && (
          <p className="text-xs text-red-600">{errors.manufacturer.message}</p>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="manufactureDate">
            Manufacture Date
          </label>
          <input
            id="manufactureDate"
            type="date"
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
            {...register("manufactureDate")}
          />
          {errors.manufactureDate?.message && (
            <p className="text-xs text-red-600">{errors.manufactureDate.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="expireDate">
            Expire Date
          </label>
          <input
            id="expireDate"
            type="date"
            className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
            {...register("expireDate")}
          />
          {errors.expireDate?.message && (
            <p className="text-xs text-red-600">{errors.expireDate.message}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="category">
          Category
        </label>
        <input
          id="category"
          type="text"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          {...register("category")}
          placeholder="e.g. Groceries"
        />
        {errors.category?.message && (
          <p className="text-xs text-red-600">{errors.category.message}</p>
        )}
      </div>

      {/* Nutritional Info */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="nutritionalInfo">
          Nutritional Info
        </label>
        <input
          id="nutritionalInfo"
          type="text"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          {...register("nutritionalInfo")}
          placeholder="e.g. Calories, sugar, protein..."
        />
        {errors.nutritionalInfo?.message && (
          <p className="text-xs text-red-600">{errors.nutritionalInfo.message}</p>
        )}
      </div>

      {/* Available checkbox */}
      <div className="flex items-center gap-2">
        <input id="available" type="checkbox" {...register("available")} />
        <label htmlFor="available" className="text-sm font-medium">
          Available
        </label>
      </div>

      {/* SKU */}
      <div className="space-y-1">
        <label className="text-sm font-medium" htmlFor="sku">
          SKU (optional)
        </label>
        <input
          id="sku"
          type="text"
          className="h-10 w-full rounded-md border border-black/10 dark:border-white/15 bg-background px-3 text-sm outline-none focus:border-foreground/40"
          {...register("sku")}
          placeholder="e.g. HNY-001"
        />
        {errors.sku?.message && <p className="text-xs text-red-600">{errors.sku.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || pending}
        className="h-10 w-full rounded-md bg-foreground text-background text-sm font-semibold hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting || pending ? "Creating product..." : "Create product"}
      </button>
    </form>
  );
}
