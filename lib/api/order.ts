import axiosInstance from "./axios";
import { API } from "./endpoint";

/* ---------------- CREATE ORDER ---------------- */
export const createOrder = async (payload: {
  shippingFee?: number;
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    address1?: string;
    city?: string;
  };
  notes?: string;
}) => {
  try {
    const res = await axiosInstance.post(API.ORDER.CREATE, payload);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to create order",
    );
  }
};

/* ---------------- GET MY ORDERS ---------------- */
export const getMyOrders = async () => {
  try {
    const res = await axiosInstance.get(API.ORDER.GET_MY);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch orders",
    );
  }
};

/* ---------------- GET ORDER BY ID ---------------- */
export const getOrderById = async (orderId: string) => {
  try {
    const res = await axiosInstance.get(API.ORDER.GET_ONE(orderId));
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch order",
    );
  }
};

/* ---------------- ADMIN: GET ALL ORDERS ---------------- */
export const getAllOrders = async () => {
  try {
    const res = await axiosInstance.get(API.ORDER.GET_ALL);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch all orders",
    );
  }
};

/* ---------------- ADMIN: UPDATE ORDER STATUS ---------------- */
export const updateOrderStatus = async (
  orderId: string,
  payload: {
    status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
    paymentStatus?: "unpaid" | "paid";
  },
) => {
  try {
    const res = await axiosInstance.patch(
      API.ORDER.UPDATE_STATUS(orderId),
      payload,
    );
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to update order status",
    );
  }
};
