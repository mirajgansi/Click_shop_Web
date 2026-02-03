import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const ProductSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.number().positive("Price must be greater than 0"),
    manufacturer: z.string().min(1, "Manufacturer is required"),

    manufactureDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid manufacture date",
    }),
    expireDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid expire date",
    }),

    nutritionalInfo: z.string().min(1, "Nutritional info is required"),
    category: z.string().min(1, "Category is required"),

   image: z
          .instanceof(File)
          .optional()
          .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
              message: "Max file size is 5MB",
          })
          .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
              message: "Only .jpg, .jpeg, .png and .webp formats are supported",
          }),

    available: z.boolean().default(true),
    inStock: z.number().int("Stock must be an integer").min(0).default(0),

    sku: z.string().optional(),

    // server stats (should be set by backend usually)
    totalSold: z.number().int().min(0).default(0),
    totalRevenue: z.number().min(0).default(0),
    viewCount: z.number().int().min(0).default(0),

    averageRating: z.number().min(0).max(5).default(0),
    reviewCount: z.number().int().min(0).default(0),
  })
  .superRefine((data, ctx) => {
    if (Date.parse(data.expireDate) <= Date.parse(data.manufactureDate)) {
      ctx.addIssue({
        path: ["expireDate"],
        message: "Expire date must be after manufacture date",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type ProductData = z.input<typeof ProductSchema>;

export const ProductEditSchema = ProductSchema.partial();
export type ProductEditData = z.input<typeof ProductEditSchema>;
