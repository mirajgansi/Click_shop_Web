"use server";

import { revalidatePath } from "next/cache";
import { createOrder, getMyOrders, getOrderById } from "@/lib/api/order";

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
