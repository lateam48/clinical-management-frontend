import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type ButtonHTMLAttributes, forwardRef } from "react"
import { LoaderCircle } from "lucide-react"
import type { VariantProps } from "class-variance-authority"

type ButtonVariants = VariantProps<typeof Button>

interface SubmitButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
    loading?: boolean
    label?: string
    loadingText?: string
    variant?: ButtonVariants["variant"]
    size?: ButtonVariants["size"]
    showSpinnerOnly?: boolean
}

export const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(
    (
        {
            loading = false,
            label = "Submit",
            loadingText,
            className,
            variant = "default",
            size = "default",
            showSpinnerOnly = false,
            disabled,
            children,
            ...buttonProps
        },
        ref,
    ) => {
        const isDisabled = loading || disabled

        const renderContent = () => {
            if (loading) {
                if (showSpinnerOnly) {
                    return <LoaderCircle className="h-4 w-4 animate-spin" />
                }
                return (
                    <div className="flex items-center gap-2">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        <span>{loadingText ?? label}</span>
                    </div>
                )
            }

            return children || label
        }

        return (
            <Button
                ref={ref}
                type="submit"
                variant={variant}
                size={size}
                className={cn(className)}
                disabled={isDisabled}
                {...buttonProps}
            >
                {renderContent()}
            </Button>
        )
    },
)

SubmitButton.displayName = "SubmitButton"