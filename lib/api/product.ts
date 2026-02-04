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
