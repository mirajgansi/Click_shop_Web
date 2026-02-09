"use server";

import { getDriversWithStats } from "@/lib/api/admin/driver";

export async function handleGetDrivers(params?: {
  page?: number;
  size?: number;
  search?: string;
}) {
  try {
    // call the single endpoint that already returns enriched drivers
    const res = await getDriversWithStats({ search: params?.search });

    if (!res?.success) {
      return {
        success: false,
        message: res?.message || "Failed to fetch drivers",
      };
    }

    // res.data is expected to be an array of drivers (already enriched)
    const drivers = Array.isArray(res.data) ? res.data : [];

    // optional: frontend pagination (client-side) if backend doesn't paginate
    const page = params?.page ?? 1;
    const size = params?.size ?? 10;
    const total = drivers.length;
    const totalPages = Math.max(1, Math.ceil(total / size));

    const start = (page - 1) * size;
    const pagedDrivers = drivers.slice(start, start + size);

    return {
      success: true,
      drivers: pagedDrivers,
      pagination: { page, size, total, totalPages },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch drivers",
    };
  }
}
