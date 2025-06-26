import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserNav } from "@/components/layout"
import type { AuthSession } from "@/types/next-auth"
import {ModeToggle, Logo} from "@/components/global";

interface NavbarProps {
    session: AuthSession
}

export function Navbar({ session }: Readonly<NavbarProps>) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-1 items-center justify-between gap-2 px-4">
                <Logo />
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Rechercher..." className="pl-8" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Notifications</span>
                    </Button>
                    <ModeToggle />
                    <UserNav session={session} />
                </div>
            </div>
        </header>
    )
}
