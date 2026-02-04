export const API = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    WHOAMI: "/api/auth/whoami",
    UPDATEPROFILE: "/api/auth/update-profile",
    REQUEST_PASSWORD_RESET: "/api/auth/request-password-reset",
    RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
  },
  PRODUCT: {
    CREATE: "/api/products/",
    GET_ALL: "/api/products/",
    GET_ONE: (id: string) => `/api/products/${id}`,

    UPDATE: (id: string) => `/api/products/${id}`,
    DELETE: (id: string) => `/api/products/${id}`,

    UPDATE_IMAGE: "/api/products/update-image",

    BY_CATEGORY: (category: string) =>
      `/api/products/category/${encodeURIComponent(category)}`,

    RECENT: "/api/products/recent",
    TRENDING: "/api/products/trending",
    POPULAR: "/api/products/popular",
    TOP_RATED: "/api/products/top-rated",
  },

  ADMIN: {
    USER: {
      CREATE: "/api/admin/users/",
      GETALLUSER: "/api/admin/users/",
      DELETEUSER: (id: string) => `/api/admin/users/${id}`,
    },
  },
};
