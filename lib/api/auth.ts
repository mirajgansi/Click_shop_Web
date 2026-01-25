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
