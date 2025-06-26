import { cn } from "@/lib/utils"
import { Briefcase, LucideIcon } from "lucide-react"

interface LoadingContentProps {
    className?: string
    icon?: LucideIcon
    loadingText?: string
}

export const LoadingContent = ({className, loadingText, icon: Icon = Briefcase}:LoadingContentProps) => {
    return (
        <div className={cn("min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50", className)}>
            <div className="text-center">
                <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Icon className="h-8 w-8 text-white" />
                </div>
                <p className="text-gray-600">{ loadingText ?? "Redirection en cours..."}</p>
            </div>
        </div>
    )
}