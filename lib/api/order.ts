import axios from "./axios";

import { API } from "./endpoint";

/* ---------------- CREATE ORDER ---------------- */
export const createOrder = async (payload: {
  shippingFee?: number;
  shippingAddress?: {
    userName?: string;
    phone?: string;
    address1?: string;
    city?: string;
  };
  notes?: string;
}) => {
  try {
    const res = await axios.post(API.ORDER.CREATE, payload);
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
    const res = await axios.get(API.ORDER.GET_MY);
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
    const res = await axios.get(API.ORDER.GET_ONE(orderId));
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
export const getAllOrders = async (params?: {
  page?: number;
  size?: number;
  search?: string;
}) => {
  try {
    const response = await axios.get(API.ORDER.GET_ALL, {
      params,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch orders",
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
    const res = await axios.patch(API.ORDER.UPDATE_STATUS(orderId), payload);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to update order status",
    );
  }
};
export const cancelOrder = async (id: string) => {
  try {
    const res = await axios.put(API.ORDER.CANCEL(id), {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Cancel failed (400)");
  }
};
