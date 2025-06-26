"use client"

import { SessionProvider, useSession } from "next-auth/react"
import { useEffect } from "react"
import { useUserStore, UserStore } from "@/stores/userStore"

export function SessionProviders({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SessionProvider>
            <UserProvider>
                {children}
            </UserProvider>
        </SessionProvider>
    )
}


function UserProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const setUser = useUserStore((state : UserStore) => state.setUser)
    const { data: session } = useSession()

    useEffect(() => {
        if (session?.user) {
            setUser({
                id: Number(session.user.id),
                email: session.user.email ?? "",
                firstName: session.user.firstName ?? "",
                lastName: session.user.lastName ?? "",
                role: session.user.role ?? "",
            })
        }
    }, [session, setUser])

    return <>{children}</>
}