export const ApiConstants = {
  AUTH: {
    TOKEN: "/token/",
    REFRESH: "/token/refresh/",
    PROFILE: "/profile/",
  },

  TASKS: {
    LIST: "/tasks/",
    DETAIL: (id: number | string) => `/tasks/${id}/`,
    CREATE: "/tasks/",
    UPDATE: (id: number | string) => `/tasks/${id}/`,
    ARCHIVE: (id: number | string) => `/tasks/${id}/`, 
    COMPLETE: (id: number | string) => `/tasks/${id}/complete/`,
  },

  COMMISSIONS: {
    LIST: "/commissions/",
    DETAIL: (id: number | string) => `/commissions/${id}/`,
  },

  ATELIERS: {
    LIST: "/ateliers/",
    DETAIL: (id: number | string) => `/ateliers/${id}/`,
  },
} as const;