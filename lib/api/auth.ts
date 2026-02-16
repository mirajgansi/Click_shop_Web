import { error } from "console";
import axios from "./axios";
import { API } from "./endpoint";

export const register = async (registrationData: any) => {
  try {
    const response = await axios.post(API.AUTH.REGISTER, registrationData);
    return response.data;
  } catch (err: Error | any) {
    //4xx - 5xx falls in catch
    err.response?.data?.message || // message from backend
      err.message || //general exception message
      "Regisration Failed"; //fallback message
  }
};

export const login = async (loginData: any) => {
  try {
    const response = await axios.post(API.AUTH.LOGIN, loginData);
    return response.data;
  } catch (err: Error | any) {
    //4xx - 5xx falls in catch
    err.response?.data?.message || // message from backend
      err.message || //general exception message
      "Login Failed"; //fallback message
  }
};

export const whoami = async () => {
  try {
    const response = await axios.get(API.AUTH.WHOAMI);
    return response.data;
  } catch (err: Error | any) {
    throw new Error(err.response?.data?.message || "Fetching User Data Failed");
  }
};

export const updateProfile = async (profileData: any) => {
  try {
    const response = await axios.put(API.AUTH.UPDATEPROFILE, profileData, {
      headers: {
        "Content-Type": "multipart/form-data", //for file upload/multer
      },
    });
    return response.data;
  } catch (err: Error | any) {
    throw new Error(err.response?.data?.message || "Updating Profile Failed");
  }
};
export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axios.post(API.AUTH.REQUEST_PASSWORD_RESET, {
      email,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Request password reset failed",
    );
  }
};

export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string,
) => {
  try {
    const response = await axios.post(API.AUTH.RESET_PASSWORD, {
      email,
      code: code.trim(),
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || error.message || "Reset password failed",
    );
  }
};

export const deleteMe = async (password: string) => {
  try {
    const response = await axios.delete(API.AUTH.DELETEME, {
      data: { password },
      withCredentials: true,
    });

    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Deleting account failed");
  }
};
