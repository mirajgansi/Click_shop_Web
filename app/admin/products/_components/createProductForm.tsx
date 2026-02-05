"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

import { handleCreateProduct } from "@/lib/actions/product-action";
import { ProductData, ProductSchema } from "../schema";

/** ---------------- helpers ---------------- */
type ActionResponse =
  | { success: true; message?: string; data?: any }
  | { success: false; message?: string; issues?: any };

function getErrorMessage(err: unknown, fallback = "Create product failed") {
  if (!err) return fallback;
  if (err instanceof Error) return err.message || fallback;
  if (typeof err === "string") return err;

  if (typeof err === "object") {
    const anyErr = err as any;
    if (typeof anyErr.message === "string" && anyErr.message.trim()) return anyErr.message;

    if (Array.isArray(anyErr.issues) && anyErr.issues.length) {
      const first = anyErr.issues[0];
      const path = Array.isArray(first.path) ? first.path.join(".") : "";
      const msg = first.message || "Invalid input";
      return path ? `${path}: ${msg}` : msg;
    }
  }

  return fallback;
}

function normalizeActionResponse(res: any): ActionResponse {
  if (!res) return { success: false, message: "No response from server" };
  if (typeof res.success === "boolean") return res as ActionResponse;
  return { success: false, message: "Unexpected server response" };
}

/** ---------------- category modal ---------------- */
function CategoryModal({
  open,
  onClose,
  onSave,
  selected,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  selected?: string;
}) {
  const [q, setQ] = useState("");
  const categories = useMemo(
    () => ["Meat", "Cooking oil and Ghee", "Pulse", "Bakery", "Snackd", "'Baverage"],
    [],
  );

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((c) => c.toLowerCase().includes(query));
  }, [q, categories]);

  const [temp, setTemp] = useState(selected || "");

  // sync when opening
  useMemo(() => {
    if (open) setTemp(selected || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
      <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-lime-700">Select a category</h2>
          <button type="button" onClick={onClose} className="rounded-md px-2 py-1 text-sm hover:bg-black/5">
            ✕
          </button>
        </div>

        <div className="mt-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search category..."
            className="h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-black/40"
          />
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-600">Results</p>

          <div className="mt-3 max-h-60 space-y-3 overflow-auto">
            {filtered.map((c) => (
              <label
                key={c}
                className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-black/5"
              >
                <input
                  type="radio"
                  name="categoryPick"
                  checked={temp === c}
                  onChange={() => setTemp(c)}
                  className="mt-1"
                />
                <div>
                  <p className="text-sm font-semibold text-blue-700">{c}</p>
                  <p className="text-xs text-gray-500">Home&Living ▸ Bathroom ▸ {c}</p>
                </div>
              </label>
            ))}
            {!filtered.length && <p className="text-sm text-gray-500">No categories found.</p>}
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!temp) return toast.error("Please select a category");
            onSave(temp);
            onClose();
          }}
          className="mt-5 h-10 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white hover:opacity-90"
        >
          Save
        </button>
      </div>
    </div>
  );
}

/** ---------------- main wizard ---------------- */
type WizardData = ProductData & {
  currency?: string; // optional: remove if you don't want currency
};

const stepFields: Record<number, (keyof WizardData)[]> = {
  1: ["name", "image", "description"],
  2: ["currency", "price", "inStock", "category"],
  3: [
    "manufacturer",
    "manufactureDate",
    "expireDate",
    "nutritionalInfo",
    "sku",
  ],
};

export default function CreateProductWizard() {
  const [pending, startTransition] = useTransition();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [completed, setCompleted] = useState<{ 1: boolean; 2: boolean; 3: boolean }>({
    1: false,
    2: false,
    3: false,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WizardData>({
    resolver: zodResolver(ProductSchema),
    mode: "onSubmit",
    defaultValues: {
      inStock: 0,
      // currency: "NPR",
    },
  });

  const selectedCurrency = watch("currency");
  const selectedCategory = watch("category");

  const clearImage = (onChange?: (file: File | undefined) => void) => {
    setPreviewImage(null);
    onChange?.(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (file: File | undefined, onChange: (file: File | undefined) => void) => {
    if (!file) {
      setPreviewImage(null);
      onChange(undefined);
      return;
    }

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const max = 5 * 1024 * 1024;

    if (!allowed.includes(file.type)) {
      clearImage(onChange);
      toast.error("Only JPG, PNG, WEBP images are allowed");
      return;
    }
    if (file.size > max) {
      clearImage(onChange);
      toast.error("Max image size is 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.onerror = () => {
      setPreviewImage(null);
      toast.error("Failed to read image");
    };
    reader.readAsDataURL(file);

    onChange(file);
  };

  const goNext = async () => {
    const fields = stepFields[step];
    const ok = await trigger(fields as any, { shouldFocus: true });

    if (!ok) return;

    setCompleted((p) => ({ ...p, [step]: true }));
    setStep((s) => (s === 1 ? 2 : 3));
  };

  const goBack = () => setStep((s) => (s === 3 ? 2 : 1));

  const onSubmit: SubmitHandler<WizardData> = async (data) => {
    // final submit only from step 3
    if (step !== 3) return;

    // (optional) ensure step 3 fields valid before submit
    const ok = await trigger(stepFields[3] as any, { shouldFocus: true });
    if (!ok) return;

    if (pending || isSubmitting) return;

    startTransition(async () => {
      try {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", String(data.price));
        formData.append("manufacturer", data.manufacturer);
        formData.append("manufactureDate", data.manufactureDate);
        formData.append("expireDate", data.expireDate);
        formData.append("nutritionalInfo", data.nutritionalInfo);
        formData.append("category", data.category);

        if (data.currency) formData.append("currency", data.currency);

        formData.append("inStock", String(data.inStock ?? 0));
        if (data.image) formData.append("image", data.image);
        if (data.sku?.trim()) formData.append("sku", data.sku.trim());

        const raw = await handleCreateProduct(formData);
        const response = normalizeActionResponse(raw);

        if (!response.success) throw new Error(response.message || "Create product failed");

        toast.success(response.message || "Product created");
        reset();
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setCompleted({ 1: false, 2: false, 3: false });
        setStep(1);
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    });
  };

  const StepBubble = ({ n, label }: { n: 1 | 2 | 3; label: string }) => {
    const active = step === n;
    const done = completed[n];

    return (
      <button
        type="button"
        onClick={() => {
          // only allow going back to previous completed steps
          if (n < step) setStep(n);
        }}
        className="flex items-center gap-2 text-left"
      >
        <span
          className={[
            "grid h-6 w-6 place-items-center rounded-full text-xs font-bold",
            done ? "bg-blue-600 text-white" : active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700",
          ].join(" ")}
        >
          {done ? "✓" : n}
        </span>
        <span className={active ? "text-sm font-semibold text-blue-600" : "text-sm text-gray-500"}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Stepper top (only 1..3) */}
      <div className="flex flex-wrap items-center gap-6">
        <StepBubble n={1} label="Product Information" />
        <StepBubble n={2} label="Product Detail Information" />
        <StepBubble n={3} label="Product Variant Creation" />
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1 */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Product Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Product Name</label>
              <input
                type="text"
                className="h-10 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/40"
                {...register("name")}
                placeholder="e.g. Beach Towel"
              />
              {errors.name?.message && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </div>

            {/* Product Images Dropzone */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Images</label>

              <Controller
                name="image"
                control={control}
                render={({ field: { onChange } }) => (
                  <div
                    className="rounded-xl border border-dashed border-gray-300 p-6"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const f = e.dataTransfer.files?.[0];
                      handleImageChange(f, onChange);
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                    />

                    {previewImage ? (
                      <div className="flex items-start gap-4">
                        <img src={previewImage} alt="Preview" className="h-24 w-24 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Image selected</p>
                          <button
                            type="button"
                            onClick={() => clearImage(onChange)}
                            className="mt-3 inline-flex items-center rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full">
                        <div className="grid place-items-center gap-2 py-6">
                          <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-100">
                            <span className="text-lg">📷</span>
                          </div>
                          <p className="text-sm text-gray-600">Browser or Desktop</p>
                          <p className="text-xs text-gray-400">Drag & drop an image here, or click to browse</p>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              />
              {errors.image?.message && <p className="text-xs text-red-600">{String(errors.image.message)}</p>}
            </div>

            {/* Product Description */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Product Description</label>
              <textarea
                className="min-h-[110px] w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/40"
                {...register("description")}
                placeholder="A detailed description of the product helps customers to learn more about the product."
              />
              {errors.description?.message && (
                <p className="text-xs text-red-600">{errors.description.message}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Currency + Price */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">Currency</label>
                <select
                  className="h-10 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/40"
                  {...register("currency")}
                >
                  <option value="">Select currency</option>
                  <option value="NPR">NPR</option>
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                </select>
                {!selectedCurrency && (
                  <p className="text-xs text-gray-500">Please enter the product currency first.</p>
                )}
                {errors.currency?.message && (
                  <p className="text-xs text-red-600">{String(errors.currency.message)}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Product Price</label>
                <input
                  type="number"
                  step="0.01"
                  disabled={!selectedCurrency}
                  className="h-10 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/40 disabled:bg-gray-100"
                  {...register("price", { valueAsNumber: true })}
                  placeholder="0.00"
                />
                {errors.price?.message && <p className="text-xs text-red-600">{errors.price.message}</p>}
              </div>
            </div>

            {/* In Stock */}
            <div className="space-y-1">
              <label className="text-sm font-medium">In Stock</label>
              <input
                type="number"
                className="h-10 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/40"
                {...register("inStock", { valueAsNumber: true })}
              />
              {errors.inStock?.message && <p className="text-xs text-red-600">{errors.inStock.message}</p>}
            </div>

            {/* Category modal picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>

              <button
                type="button"
                onClick={() => setCategoryOpen(true)}
                className="h-10 w-full rounded-md border border-black/10 px-3 text-left text-sm outline-none hover:bg-black/5"
              >
                {selectedCategory ? selectedCategory : "Select category"}
              </button>

              {errors.category?.message && <p className="text-xs text-red-600">{errors.category.message}</p>}

              <CategoryModal
                open={categoryOpen}
                onClose={() => setCategoryOpen(false)}
                selected={selectedCategory}
                onSave={(value) => setValue("category", value as any, { shouldValidate: true })}
              />
            </div>
          </motion.div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Manufacturer */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Manufacturer</label>
              <input
                type="text"
                className="h-10 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/40"
                {...register("manufacturer")}
              />
              {errors.manufacturer?.message && (
                <p className="text-xs text-red-600">{errors.manufacturer.message}</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">Manufacture Date</label>
                <input
                  type="date"
                  className="h-10 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/40"
                  {...register("manufactureDate")}
                />
                {errors.manufactureDate?.message && (
                  <p className="text-xs text-red-600">{errors.manufactureDate.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Expire Date</label>
                <input
                  type="date"
                  className="h-10 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/40"
                  {...register("expireDate")}
                />
                {errors.expireDate?.message && (
                  <p className="text-xs text-red-600">{errors.expireDate.message}</p>
                )}
              </div>
            </div>

            {/* Nutritional Info */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Nutritional Info</label>
              <input
                type="text"
                className="h-10 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/40"
                {...register("nutritionalInfo")}
              />
              {errors.nutritionalInfo?.message && (
                <p className="text-xs text-red-600">{errors.nutritionalInfo.message}</p>
              )}
            </div>


            {/* SKU */}
            <div className="space-y-1">
              <label className="text-sm font-medium">SKU (optional)</label>
              <input
                type="text"
                className="h-10 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/40"
                {...register("sku")}
              />
              {errors.sku?.message && <p className="text-xs text-red-600">{errors.sku.message}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            if (step === 1) {
              reset();
              setPreviewImage(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
              setCompleted({ 1: false, 2: false, 3: false });
              toast.info("Cleared");
              return;
            }
            goBack();
          }}
          className="h-10 rounded-md border border-gray-200 px-4 text-sm font-semibold hover:bg-black/5"
        >
          {step === 1 ? "Cancel" : "Back"}
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className="h-10 rounded-md bg-blue-600 px-6 text-sm font-semibold text-white hover:opacity-90"
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting || pending}
            className="h-10 rounded-md bg-blue-600 px-6 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting || pending ? "Saving..." : "Create Product"}
          </button>
        )}
      </div>
    </form>
  );
}
