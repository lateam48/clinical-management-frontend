import NextAuth, {NextAuthConfig} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {getEnv} from "@/lib/env";

export const authOptions = {
    secret: getEnv().authSecret,
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
    },
    providers: [
        Credentials({
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"},
            },
            authorize: async (credentials) => {
                try {
                    const res = await fetch(`${getEnv().apiUrl}/auth/login`, {
                        method: "POST",
                        body: JSON.stringify(credentials),
                        headers: {"Content-Type": "application/json"}
                    });

                    if (!res.ok) {
                        const error = await res.json();
                        throw new Error(error.message ?? "Authentication failed");
                    }

                    const {token, user} = await res.json();
                    return {
                        id: user.id.toString(),
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: (user.role as string)?.toUpperCase(),
                        accessToken: token,
                    };
                } catch (error) {
                    console.error("Authorization error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.accessToken = user.accessToken;
                token.role = user.role?.toUpperCase();
                token.id = user.id;
            }
            return token;
        },
        async session({session, token}) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = (token.role as string)?.toUpperCase();
            }
            session.accessToken = token.accessToken as string;
            return session;
        },
    },
    pages: {
        signIn: "/login",
    }
} as NextAuthConfig;
const nextAuthInstance = NextAuth(authOptions);

export const {auth, signIn, signOut, handlers} = nextAuthInstance