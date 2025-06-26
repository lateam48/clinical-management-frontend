import Link from "next/link";
import { Hospital } from "lucide-react";

export function Logo() {
    return (
        <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Hospital className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">
                BelviCare
            </span>
        </Link>
    )
}