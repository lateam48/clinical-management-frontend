"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export function LogoutButton() {
    return (
        <Button variant="ghost" className="w-full justify-start" onClick={() => signOut({ redirectTo: "/login" })}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
        </Button>
    )
}
