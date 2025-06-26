import axios, {
    type AxiosError,
    type AxiosInstance,
    type InternalAxiosRequestConfig,
} from "axios"
import { getSession } from "next-auth/react"
import {getEnv} from "@/lib/env";

export const apiClient: AxiosInstance = axios.create({
    baseURL: getEnv().apiUrl,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
})

apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            const session = await getSession();
            if (session?.accessToken) {
                config.headers = config.headers ?? {};
                config.headers.Authorization = `Bearer ${session.accessToken}`;
            }
            return config;
        } catch (error) {
            // Always reject with Error object
            return Promise.reject(
                error instanceof Error ? error : new Error("Request interceptor error")
            );
        }
    },
    (error: AxiosError) => {
        // Always reject with Error object
        return Promise.reject(
            error instanceof Error ? error : new Error("Request error")
        );
    }
);

apiClient.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        if (typeof window !== "undefined") {
            const status = error.response?.status;

            if (status === 401) {
                // Create proper error before redirecting
                const err = new Error("Session expired");
                err.name = "SessionExpiredError";
                window.location.href = `/login?error=session_expired`;
                return Promise.reject(err);
            }
            else if (status === 403) {
                const err = new Error("Unauthorized access");
                err.name = "UnauthorizedError";
                window.location.href = `/unauthorized`;
                return Promise.reject(err);
            }
            else if (status === 500) {
                const err = new Error("Server error");
                err.name = "ServerError";
                console.error("Server Error:", error);
                return Promise.reject(err);
            }

            if (!error.response) {
                const err = new Error("Network error");
                err.name = "NetworkError";
                console.error("Network Error:", error.message);
                return Promise.reject(err);
            }
        }

        // Ensure we always reject with an Error instance
        return Promise.reject(
            error instanceof Error ? error : new Error("Unknown error")
        );
    }
);