import axios from "./axios";
import { API } from "./endpoint";
import axiosInstance from "./axios";

export const createProduct = async (formData: FormData) => {
  try {
    const response = await axios.post(API.PRODUCT.CREATE, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Create Product failed",
    );
  }
};

export const getAllProduct = async (params?: {
  page?: number;
  size?: number;
  search?: string;
}) => {
  try {
    const response = await axios.get(API.PRODUCT.GET_ALL, {
      params,
    });
    console.log("BASE:", axiosInstance.defaults.baseURL);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch products",
    );
  }
};
export const getProductById = async (id: string) => {
  try {
    const response = await axios.get(API.PRODUCT.GET_ONE(id));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch product",
    );
  }
};

// UPDATE PRODUCT (JSON body)
export const updateProduct = async (id: string, payload: any) => {
  try {
    const response = await axios.put(API.PRODUCT.UPDATE(id), payload, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Update product failed",
    );
  }
};

// UPDATE PRODUCT IMAGE (multipart)
export const updateProductImage = async (formData: FormData) => {
  try {
    const response = await axios.put(API.PRODUCT.UPDATE_IMAGE, formData, {
      withCredentials: true,
      // ✅ Don't set Content-Type manually for FormData
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Update image failed",
    );
  }
};

// DELETE PRODUCT
export const deleteProduct = async (id: string) => {
  try {
    const response = await axios.delete(API.PRODUCT.DELETE(id), {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Delete product failed",
    );
  }
};

// FILTERS / LISTS
export const getProductsByCategory = async (category: string) => {
  try {
    const response = await axios.get(API.PRODUCT.BY_CATEGORY(category));
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch category products",
    );
  }
};

export const getRecentProducts = async () => {
  const res = await axios.get(API.PRODUCT.RECENT);
  return res.data;
};

export const getTrendingProducts = async () => {
  const res = await axios.get(API.PRODUCT.TRENDING);
  return res.data;
};

export const getPopularProducts = async () => {
  const res = await axios.get(API.PRODUCT.POPULAR);
  return res.data;
};

export const getTopRatedProducts = async () => {
  const res = await axios.get(API.PRODUCT.TOP_RATED);
  return res.data;
};
