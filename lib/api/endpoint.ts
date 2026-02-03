export const API = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    WHOAMI: "/api/auth/whoami",
    UPDATEPROFILE: "/api/auth/update-profile",
  },
 PRODUCT: {
      CREATE: "/api/products/",
      GET_ALL: "/api/products/",
      GET_ONE: (id: string) => `/api/products/${id}`,
    },
  ADMIN: {
    USER: {
      CREATE: "/api/admin/users/",
      GETALLUSER: "/api/admin/users/",
    },
   
  },
};
