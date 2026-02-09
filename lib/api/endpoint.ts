export const API = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    WHOAMI: "/api/auth/whoami",
    UPDATEPROFILE: "/api/auth/update-profile",
    REQUEST_PASSWORD_RESET: "/api/auth/request-password-reset",
    RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
    DELETEME: "/api/auth/me",
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
  DRIVER: {
    GET_ALL: "/api/driver/drivers", // list drivers + profile
    GET_STATS: "/api/driver/stats", // stats for table
    GET_ONE_STATS: (id: string) => `/api/driver/stats/${id}`, // single driver stats
    GET_ONE_DRIVER: (id: string) => `/api/driver/${id}/detail`,
  },
  CART: {
    GET_MY_CART: "/api/cart/",
    ADD_ITEM: "/api/cart/items",
    UPDATE_ITEM_QTY: (productId: string) => `/api/cart/items/${productId}`,
    REMOVE_ITEM: (productId: string) => `/api/cart/items/${productId}`,
    CLEAR: "/api/cart/",
  },
  ORDER: {
    CREATE: "/api/orders",
    GET_MY: "/api/orders/me",
    GET_ONE: (id: string) => `/api/orders/${id}`,

    // admin
    GET_ALL: "/api/orders/",
    UPDATE_STATUS: (id: string) => `/api/orders/${id}/status`,
    CANCEL: (id: string) => `/api/orders/${id}/cancel`,
    ASSIGN_DRIVER: (id: string) => `/api/orders/${id}/assign-driver`,

    GET_MY_ASSIGNED: "/api/orders/driver/my-orders",
    DRIVER_UPDATE_STATUS: (id: string) => `/api/orders/driver/${id}/status`,

    GET_DRIVERS: "/api/admin/users",
  },
};
