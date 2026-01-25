"use server";

import { set } from "zod";
//Server  side actions
import { register, login, whoami, updateProfile } from "../api/auth";
import { setAuthToken, setUserData } from "../cookie";
import { revalidatePath } from "next/cache";

export async function handleRegister(formData: any) {
  try {
    //how to ake data from componenets
    const result = await register(formData);
    // how to send data to componenet
    if (result.success) {
      return {
        success: true,
        message: "message successfull",
        data: result.data,
      };
    }
    return { success: false, message: "Registration failed" };
  } catch (err: Error | any) {
    return { success: false, message: err.message };
  }
}

export async function handleLogin(formData: any) {
  try {
    //how to ake data from componenets
    const result = await login(formData);
    // how to send data to componenet
    if (result.success) {
      await setUserData(result.data);
      await setAuthToken(result.token);
      return {
        success: true,
        message: "message successfull",
        data: result.data,
      };
    }
    return { success: false, message: "Login failed" };
  } catch (err: Error | any) {
    return { success: false, message: err.message };
  }
}

export async function handleWhoami() {
  try {
    const result = await whoami();

    if (result.success) {
      return {
        success: true,
        message: "message successful",
        data: result.data,
      };
    }

    return { success: false, message: result.message ?? "Login failed" };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export async function handleUpdateProfile(formData: any) {
  try {
    const result = await updateProfile(formData);
    if (result.success) {
      await setUserData(result.data); //update cookie
      revalidatePath("/user/profile"); //revalidate profile page
      return {
        success: true,
        message: "Profile updated successfully",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result.message || "Profile update failed",
    };
  } catch (err: Error | any) {
    return { success: false, message: err.message };
  }
}
