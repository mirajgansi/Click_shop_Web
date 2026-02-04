import axios from "./axios";
import { API } from "./endpoint";

export const getMyCart = async () => {
  try {
    const res = await axios.get(API.CART.GET_MY_CART, {});
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to fetch cart",
    );
  }
};

export const addCartItem = async (payload: {
  productId: string;
  quantity?: number;
}) => {
  try {
    console.log("POST:", API.CART.ADD_ITEM);
    console.log("BASE URL:", axios.defaults?.baseURL);
    const res = await axios.post(API.CART.ADD_ITEM, payload, {});
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to add item",
    );
  }
};

export const updateCartItemQuantity = async (
  productId: string,
  quantity: number,
) => {
  try {
    const res = await axios.patch(API.CART.UPDATE_ITEM_QTY(productId), {
      quantity,
    });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to update quantity",
    );
  }
};

export const removeCartItem = async (productId: string) => {
  try {
    const res = await axios.delete(API.CART.REMOVE_ITEM(productId), {});
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to remove item",
    );
  }
};

export const clearCart = async () => {
  try {
    const res = await axios.delete(API.CART.CLEAR, {});
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Failed to clear cart",
    );
  }
};
