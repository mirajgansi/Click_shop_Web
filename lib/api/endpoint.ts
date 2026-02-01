export const API = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    WHOAMI: "/api/auth/whoami",
    UPDATEPROFILE: "/api/auth/update-profile",
  },
  PRODUCT: {
    CREATEPRODUCT: "/api/products/CreateProduct",
    GETAllPRODUCTS: "/api/products",
    GET1PRODUCTS: "/api/products/:id",
  },
  ADMIN: {
    USER: {
      CREATE: "/api/admin/users/",
    },
  },
};
