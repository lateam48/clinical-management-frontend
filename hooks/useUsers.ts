import { useMutation, useQuery } from '@tanstack/react-query';
import { userServices } from "@/services/usersServices"
import { queryClient } from '@/providers';
import { toast } from 'sonner';
import { UserRole, User, RegisterRequest, UpdateUserRequest, ApiError } from '@/types';
import { UsersCacheKeys } from "@/lib/const"

// single user

export const useUser = ({ userId }: {
    userId?: User['id']
}) => {
    const createUser = useMutation({
        mutationFn: ({ data }: { data: RegisterRequest }) =>
            userServices.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [UsersCacheKeys.Users]
            })
            toast.success("Succès", {
                description: "Utilisateur créé avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de créer l'utlisateur",
            })
        }
    })

    const updateUser = useMutation({
        mutationFn: ({ id, data }: { id: User['id'], data: UpdateUserRequest }) =>
            userServices.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [UsersCacheKeys.Users]
            })
            toast.success("Succès", {
                description: "Utilisateur mis à jour avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de mettre à jour l'utilisateur",
            })
        }
    })

    const getUser = useQuery({
        queryKey: [UsersCacheKeys.Users, userId],
        queryFn: () =>
            userServices.getById(userId as User['id']),
        enabled: !!userId
    })

    const deleteUser = useMutation({
        mutationFn: (userId: User['id']) => userServices.delete(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [UsersCacheKeys.Users]
            })
            toast.success("Succès", {
                description: "Utilisateur supprimé avec succès",
            })
        },
        onError: (error: ApiError) => {
            toast.error("Erreur", {
                description: error.response?.data?.message ?? "Impossible de supprimer l'utilisateur",
            })
        }
    })

    return {
        createUser,
        updateUser,
        getUser,
        deleteUser
    }
}


// all users

export const useUsers = (filters?: { role?: UserRole }) => {
    const getUsers = useQuery({
        queryKey: [UsersCacheKeys.Users, filters],
        queryFn: () => userServices.getAll(filters?.role)
    })

    return {
        getUsers
    }
}

// Staff hooks

export const useStaff = (filters?: { role?: UserRole }) => {
    const getStaff = useQuery({
        queryKey: [UsersCacheKeys.Staff, filters],
        queryFn: () => userServices.getAllStaff(filters?.role)
    })

    return {
        getStaff
    }
}

export const useStaffMember = ({ staffId }: {
    staffId?: User['id']
}) => {
    const getStaffMember = useQuery({
        queryKey: [UsersCacheKeys.Staff, staffId],
        queryFn: () =>
            userServices.getStaffById(staffId as User['id']),
        enabled: !!staffId
    })

    return {
        getStaffMember
    }
}