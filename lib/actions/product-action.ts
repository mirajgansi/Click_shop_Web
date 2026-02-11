"use server";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getPopularProducts,
  getProductById,
  getProductsByCategory,
  getRecentProducts,
  getTrendingProducts,
  updateProduct,
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
export const handleGetProductsByCategory = async (
  category: string,
  params?: {
    page?: number;
    size?: number;
    search?: string;
  },
) => {
  try {
    if (!category) return { success: false, message: "Missing category" };

    const response = await getProductsByCategory(category); // or pass params if your backend supports it

    if (response.success) {
      return {
        success: true,
        message: "Category products fetched successfully",
        products: response.data.products ?? response.data,
        pagination: response.data.pagination,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to fetch category products",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch category products",
    };
  }
};

export async function handleUpdateProduct(
  productId: string,
  formData: FormData,
) {
  try {
    const res = await updateProduct(productId, formData);

    if (res?.success) {
      revalidatePath("/admin/products");
      revalidatePath(`/admin/products/edit/${productId}`);
    }

    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update product",
    };
  }
}

export async function handleGetRecentProducts(limit = 10) {
  try {
    const res = await getRecentProducts(limit);
    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch recent product",
    };
  }
}

export async function handleGetTrendingProducts(limit = 10) {
  try {
    const res = await getTrendingProducts(limit); // 👈 CALL + PASS limit
    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch trending product",
    };
  }
}

export async function handleGetPopularProducts(limit = 10) {
  try {
    const res = await getPopularProducts(limit); // 👈 CALL + PASS limit
    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch popular product",
    };
  }
}

// export async function handleGetTopRatedProducts(limit = 10) {
//   try {
//     const res = await axios.get(PRODUCT_API.TOP_RATED, { params: { limit } });
//     return res.data;
//   } catch (error: any) {
//     return {
//       success: false,
//       message: getErrorMessage(error, "Failed to fetch top rated products"),
//     };
//   }
// }
