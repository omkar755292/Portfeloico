const ENV = {
  PROD: "PROD",
  DEV: "DEV",
  LOCAL: "LOCAL",
} as const;

type EnvType = keyof typeof ENV;

const URLS = {
  BASE: {
    [ENV.LOCAL]: "http://localhost:5000",
    [ENV.DEV]: "https://dev-api.example.com",
    [ENV.PROD]: "https://prod-api.example.com",
  },
  FRONTEND: {
    [ENV.LOCAL]: "http://localhost:500",
    [ENV.DEV]: "https://dev.example.com",
    [ENV.PROD]: "https://prod.example.com",
  },
} as const;

// Detect Environment in Next.js
const getEnvironment = (): EnvType => {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT) {
    return process.env.NEXT_PUBLIC_ENVIRONMENT as EnvType;
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (/localhost|127\.0\.0\.1/.test(hostname)) {
      return ENV.LOCAL;
    }
    if (/^dev(\.|-)/.test(hostname)) {
      return ENV.DEV;
    }
  }

  return ENV.PROD;
};

export const environment: EnvType = getEnvironment();

const API_ENDPOINTS = {
  user: {
    login: "/auth/login",
    register: "/auth/register",
  },
} as const;

export const API = {
  baseUrl: URLS.BASE[environment],
  frontendUrl: URLS.FRONTEND[environment],
  environment,
  ...API_ENDPOINTS,
} as const;
