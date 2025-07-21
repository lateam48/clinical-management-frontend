export const UserRoles = {
    ADMIN: "ADMIN",
    DOCTOR: "DOCTOR",
    SECRETARY: "SECRETARY"
} as const;

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles];


export interface UserResponseData{
  id:number
  username:string
  email:string
  firstName:string
  lastName:string
  role:UserRole
}

export interface ApiError {
    response?: {
        data?: {
            message?: string;
            status?: number
        };
    };
}

// export types

export * from "./user"
export * from "./prescription"
export * from "./chat"
export * from "./appointment"
export * from "./invoice"