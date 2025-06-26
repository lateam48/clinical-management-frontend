"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Info, User, Shield, Eye, EyeOff, Clipboard } from "lucide-react"
import { SubmitButton } from "@/components/global"

const LoginSchema = z.object({
    email: z.string().email("Valid email is required"),
    password: z.string().min(1, "Password is required"),
})

export function LoginForm() {
    const testAccounts = [
        { role: "Admin", email: "admin@belvicare.com", password: "password", name: "M. Paul Nkomo", icon: Shield },
        { role: "Docteur", email: "doctor@belvicare.com", password: "password", name: "Dr. Samuel Njoya", icon: User },
        { role: "Secrétaire", email: "secretary@belvicare.com", password: "password", name: "Estelle Mbarga", icon: Clipboard },
    ]
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: { email: "", password: "" },
    })

    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const fillTestAccount = (email: string, password: string) => {
        form.setValue("email", email)
        form.setValue("password", password)
    }

    async function onSubmit(data: z.infer<typeof LoginSchema>) {
        setLoading(true)
        try {
            const result = await signIn("credentials", {
                redirect: false,
                ...data,
            })

            if (result?.error) {
                throw new Error(result.error)
            }

            if (result?.ok) {
                toast.success("🎉 Connexion réussie!", {
                    description: "Bienvenue sur BelviCare!",
                })
                router.push("/dashboard")
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue"
            toast.error("Authentication Failed", {
                description: errorMessage === "CredentialsSignin" ? "Email ou mot de passe incorrect" : "Une erreur est survenue",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
            <div className="w-full max-w-md md:max-w-full flex flex-col md:flex-row md:justify-center gap-6">
                <Card className="shadow-lg  w-full md:max-w-md grid items-center">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
                        <CardDescription>Connectez-vous à votre compte BelviCare</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Adresse email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="votre@email.com"
                                                    {...field}
                                                    disabled={loading}
                                                    className="h-11"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mot de passe</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        {...field}
                                                        disabled={loading}
                                                        className="h-11 pr-10"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        disabled={loading}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                        <span className="sr-only">
                              {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                            </span>
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <SubmitButton className="w-full h-11 mt-6" loading={loading} label="Se connecter" />
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card className="shadow-lg">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-muted-foreground" />
                            <CardTitle className="text-lg">Comptes de démonstration</CardTitle>
                        </div>
                        <CardDescription>Utilisez ces comptes pour tester l&apos;application</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {testAccounts.map((account, index) => {
                            const IconComponent = account.icon
                            return (
                                <div key={account.email}>
                                    <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                <IconComponent className="h-4 w-4 text-primary" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{account.role}</p>
                                                <p className="text-xs text-muted-foreground">{account.name}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => fillTestAccount(account.email, account.password)}
                                            disabled={loading}
                                            className="shrink-0"
                                        >
                                            Utiliser
                                        </Button>
                                    </div>
                                    {index < testAccounts.length - 1 && <Separator className="my-3" />}
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
