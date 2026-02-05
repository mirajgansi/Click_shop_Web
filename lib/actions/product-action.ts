"use server";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProductById,
} from "@/lib/api/product";
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
        products: response.data.products ?? response.data,
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
      message: error.message || "Failed to fetch products",
    };
  }
};
export const handleGetProductById = async (id: string) => {
  try {
    if (!id) return { success: false, message: "Missing product id" };

    const response = await getProductById(id);

    if (response.success) {
      return {
        success: true,
        product: response.data,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to fetch product",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch product",
    };
  }
};

export async function handleDeleteProduct(id: string) {
  try {
    const result = await deleteProduct(id);

    if (result?.success) {
      // ✅ refresh pages that show products
      revalidatePath("/admin/products");
      revalidatePath("/user/products");

      return {
        success: true,
        message: result.message || "Product deleted successfully",
        data: result.data,
      };
    }

    return {
      success: false,
      message: result?.message || "Delete product failed",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Delete product failed",
    };
  }
}
