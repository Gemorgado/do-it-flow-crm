
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent text-[#000000] hover:bg-accent/10 opacity-100",
        destructive:
          "bg-transparent text-[#000000] hover:bg-destructive/10 opacity-100",
        outline:
          "border border-input bg-transparent text-[#000000] hover:bg-accent/10 hover:text-accent-foreground opacity-100",
        secondary:
          "bg-transparent text-[#000000] hover:bg-secondary/10 opacity-100",
        ghost: "bg-transparent text-[#000000] hover:bg-accent/10 hover:text-accent-foreground opacity-100",
        link: "bg-transparent text-[#000000] underline-offset-4 hover:underline opacity-100",
        navbar: "bg-transparent text-[#000000] hover:bg-accent/10 opacity-100",
        sidebar: "bg-transparent text-[#000000] hover:bg-sidebar-accent/10 opacity-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Apply transparent background for all buttons
    const customStyle = { 
      ...style,
      backgroundColor: 'transparent'
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={{ opacity: 1, ...customStyle }}
        data-variant={variant}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
