"use client"

import { getNavigationForRole } from "@/lib/navigation"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogoutButton } from "@/components/global/logout-button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { AuthSession } from "@/types/next-auth"
import type { UserRole } from "@/types"

interface AppSidebarProps {
    session: AuthSession
}

export function AppSidebar({ session }: AppSidebarProps) {
    const pathname = usePathname()
    const user = session?.user

    if (!user) return null

    const navigation = getNavigationForRole(user.role as UserRole)
    const initials =
        user.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "U"

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-3 px-2 py-4">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || ""} alt={user.name || ""} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.role}</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigation.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href

                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <Link href={item.href}>
                                                <Icon className="h-4 w-4" />
                                                <span>{item.title}</span>
                                                {item.badge && (
                                                    <span className="ml-auto text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <div className="p-2">
                    <LogoutButton />
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
