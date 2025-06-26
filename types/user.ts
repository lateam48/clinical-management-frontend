import { UseMutationResult } from "@tanstack/react-query"
import type {ApiError, UserRole } from "./index"

export interface User {
    id: number
    username: string
    password: string
    email: string
    firstName: string
    lastName: string
    role: UserRole
}

export interface LoginRequest {
    email: string
    password: string
}

export interface AuthResponse {
    token: string
    user: User
}

export interface RegisterRequest {
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
    role: UserRole
}

export interface UpdateUserRequest {
    username: string
    email: string
    firstName: string
    lastName: string
    role: UserRole
}

export type CreateUserMutation = UseMutationResult<User, ApiError, { data: RegisterRequest }, unknown>
export type UpdateUserMutation = UseMutationResult<User, ApiError, { id: number; data: UpdateUserRequest }, unknown>
export type DeleteUserMutation = UseMutationResult<unknown, ApiError, number, unknown>