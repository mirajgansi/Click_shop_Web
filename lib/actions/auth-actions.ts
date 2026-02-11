"use server";

import { set } from "zod";
//Server  side actions
import {
  register,
  login,
  whoami,
  updateProfile,
  requestPasswordReset,
  resetPassword,
  deleteMe,
} from "../api/auth";
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
    const result = await login(formData);

    // ✅ success
    if (result?.success === true) {
      await setUserData(result.data);
      await setAuthToken(result.token);

      return {
        success: true,
        message: "Login successful",
        data: result.data,
      };
    }

    return {
      success: false,
      field: result?.field, // "email" | "password" (optional)
      message: result?.message || "Invalid email or password",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Server error. Please try again.",
    };
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
export const handleRequestPasswordReset = async (email: string) => {
  try {
    const response = await requestPasswordReset(email);
    if (response.success) {
      return {
        success: true,
        message: "Password reset email sent successfully",
      };
    }
    return {
      success: false,
      message: response.message || "Request password reset failed",
    };
  } catch (error: Error | any) {
    return {
      success: false,
      message: error.message || "Request password reset action failed",
    };
  }
};

export const handleResetPassword = async (
  email: string,
  code: string,
  newPassword: string,
) => {
  try {
    const response = await resetPassword(email, code, newPassword);

    if (response.success) {
      return {
        success: true,
        message: response.message || "Password has been reset successfully",
      };
    }

    return {
      success: false,
      message: response.message || "Reset password failed",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Reset password action failed",
    };
  }
};

export async function handleDeleteMe(password: string) {
  try {
    const result = await deleteMe(password);

    if (result.success) {
      return {
        success: true,
        message: "Account deleted successfully",
      };
    }

    return {
      success: false,
      message: result.message ?? "Deleting failed",
    };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}
