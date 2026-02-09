import axios from "../axios";
import { API } from "../endpoint";

export const getDrivers = async (params?: {
  search?: string;
  page?: number;
  size?: number;
}) => {
  try {
    const res = await axios.get(API.ORDER.GET_DRIVERS, {
      params: { ...params, role: "driver" },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch drivers",
    );
  }
};

export async function getDriversWithStats(params?: { search?: string }) {
  const res = await axios.get(API.DRIVER.GET_STATS, { params });
  return res.data;
}
export async function getDriverStatsById(driverId: string) {
  const res = await axios.get(API.DRIVER.GET_ONE_STATS(driverId));
  return res.data;
}
