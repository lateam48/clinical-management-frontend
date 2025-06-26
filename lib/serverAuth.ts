import { redirect } from "next/navigation";
import { UserRole } from "@/types";
import type { AuthSession } from "@/types/next-auth"
import { auth } from "@/lib/auth";

// Centralized authentication logic
export async function authenticate(redirectPath = "/login") {
    const session = (await auth()) as AuthSession | null;

    if (!session?.user) {
        redirect(redirectPath);
    }

    return session;
}

// Centralized authorization logic
export async function authorize(
    session: AuthSession | null,
    allowedRoles: UserRole[],
    redirectPath = "/unauthorized"
): Promise<boolean> {
    const userRole = session?.user?.role as UserRole | undefined;

    if (!userRole || !allowedRoles.includes(userRole)) {
        console.warn("Unauthorized access by role:", userRole);
        redirect(redirectPath);
        return false;
    }
    return true;
}

// Combined authentication + authorization
export async function getAuthenticatedUser(options?: {
    allowedRoles?: UserRole[];
    authRedirect?: string;
    authzRedirect?: string;
}) {
    const session = await authenticate(options?.authRedirect);

    if (options?.allowedRoles) {
        await authorize(session, options.allowedRoles, options?.authzRedirect);
    }

    return { session };
}