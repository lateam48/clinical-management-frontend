import {ThemeProvider, QueryProvider, SessionProviders} from "@/providers";
import {Toaster} from "@/components/ui/sonner";

export function AppProvider({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <QueryProvider>
                <SessionProviders>{children}</SessionProviders>
            </QueryProvider>
            <Toaster
                position={"bottom-right"}
                richColors={true}
                closeButton={true}
            />
        </ThemeProvider>
    );
}