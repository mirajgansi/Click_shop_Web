"use server";

import { revalidatePath } from "next/cache";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "@/lib/api/order";

type ActionResponse<T = any> =
  | { success: true; message?: string; data?: T }
  | { success: false; message: string; issues?: any };

function getErrMsg(err: any, fallback = "Something went wrong") {
  return err?.response?.data?.message || err?.message || fallback;
}

/**
 * Checkout: create order from cart
 * Backend computes items/totals from cart, so payload only has shipping/payment info.
 */
export async function handleCreateOrder(payload: {
  shippingFee?: number;
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  notes?: string;
}): Promise<ActionResponse> {
  try {
    const res = await createOrder(payload);

    if (!res?.success) {
      return {
        success: false,
        message: res?.message || "Failed to create order",
        issues: res?.issues,
      };
    }

    revalidatePath("/cart");
    revalidatePath("/orders");
    revalidatePath("/user/orders");

    return {
      success: true,
      message: res?.message || "Order created",
      data: res?.data,
    };
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to create order";

    return {
      success: false,
      message,
    };
  }
}
export const handleGetAllOrders = async (params?: {
  page?: number;
  size?: number;
  search?: string;
}) => {
  try {
    const response = await getAllOrders(params);

    if (response.success) {
      return {
        success: true,
        message: "Orders fetched successfully",
        orders: response.data.orders ?? response.data,
        pagination: response.data.pagination,
      };
    }

    return {
      success: false,
      message: response.message || "Failed to fetch orders",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch orders",
    };
  }
};
export async function handleGetMyOrders(): Promise<ActionResponse> {
  try {
    const res = await getMyOrders();

    if (!res?.success) {
      return {
        success: false,
        message: res?.message || "Failed to fetch orders",
        issues: res?.issues,
      };
    }

    return { success: true, data: res?.data };
  } catch (err: any) {
    return {
      success: false,
      message: getErrMsg(err, "Failed to fetch orders"),
    };
  }
}

export async function handleGetOrderById(
  orderId: string,
): Promise<ActionResponse> {
  try {
    const res = await getOrderById(orderId);

    if (!res?.success) {
      return {
        success: false,
        message: res?.message || "Failed to fetch order",
        issues: res?.issues,
      };
    }

    return { success: true, data: res?.data };
  } catch (err: any) {
    return { success: false, message: getErrMsg(err, "Failed to fetch order") };
  }
}

export async function handleUpdateOrderStatus(
  orderId: string,
  payload: {
    status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
    paymentStatus?: "unpaid" | "paid";
  },
) {
  try {
    if (!orderId) {
      return { success: false, message: "Order ID is required" };
    }

    const result = await updateOrderStatus(orderId, payload);

    // Revalidate admin & user order pages (adjust paths)
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/user/orders");

    return {
      success: true,
      message: "Order status updated successfully",
      data: result?.data ?? result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update order status",
    };
  }
}
