"use server";
import { createProduct, getAllProduct } from "@/lib/api/product";
import { revalidatePath } from "next/cache";

export const handleCreateProduct = async (data: FormData) => {
  try {
    const response = await createProduct(data);
    if (response.success) {
      revalidatePath("/products");

      return {
        success: true,
        message: "Create Product successful",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Failed to create Product",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Failed to create Product",
    };
  }
};
export const handleGetAllProducts = async (params?: {
  page?: number;
  size?: number;
  search?: string;
}) => {
  try {
    const response = await getAllProduct(params);

    if (response.success) {
      return {
        success: true,
        message: "All products fetched successfully",
        products: response.data.products ?? response.data, // ✅ FIX
        pagination: response.data.pagination,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to fetch products",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch products", // ✅ FIX
    };
  }
};
