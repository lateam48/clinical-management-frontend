import { apiClient } from "@/lib/axios"
import { RegisterRequest, UpdateUserRequest, User, UserRole } from "@/types"

const BASE_URL = '/admin/users'
const STAFF_URL = '/staff'

export const userServices = {
    getAll: async (role?: UserRole) => {
        const params = role ? { role } : {};
        const response = await apiClient.get<User[]>(`${BASE_URL}`, { params });
        return response.data;
    },
    create: async (data: RegisterRequest) => {
        const response = await apiClient.post<User>(`${BASE_URL}`, data)
        return response.data
    },
    getById: async (id: User['id']) => {
        const response = await apiClient.get<User>(`${BASE_URL}/${id}`)
        return response.data
    },
    delete: async (id: User['id']) => {
        const response = await apiClient.delete(`${BASE_URL}/${id}`)
        return response.data
    },
    update: async (id: User['id'], data: UpdateUserRequest) => {
        const response = await apiClient.put<User>(`${BASE_URL}/${id}`, data)
        return response.data
    },
    // Staff methods
    getAllStaff: async (role?: UserRole) => {
        const params = role ? { role } : {};
        const response = await apiClient.get<User[]>(`${STAFF_URL}`, { params });
        return response.data;
    },
    getStaffById: async (id: User['id']) => {
        const response = await apiClient.get<User>(`${STAFF_URL}/${id}`)
        return response.data
    }
}
