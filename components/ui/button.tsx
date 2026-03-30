import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button button-chrome inline-flex shrink-0 items-center justify-center rounded-full text-sm font-medium whitespace-nowrap tracking-[0.02em] outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/35 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "text-[hsl(24_35%_10%)] [--button-border:rgba(232,175,72,0.48)] [--button-highlight:rgba(254,234,165,0.34)] [--button-core:linear-gradient(180deg,rgba(255,244,197,0.98),rgba(196,151,70,0.92))]",
        outline:
          "text-foreground [--button-border:rgba(232,175,72,0.24)] [--button-highlight:rgba(232,175,72,0.18)] [--button-core:linear-gradient(180deg,rgba(var(--toolbar-plate-rgb),0.88),rgba(var(--toolbar-rgb),0.92))]",
        secondary:
          "text-foreground [--button-border:rgba(var(--toolbar-border-rgb),0.16)] [--button-highlight:rgba(232,175,72,0.12)] [--button-core:linear-gradient(180deg,rgba(var(--toolbar-plate-rgb),0.76),rgba(var(--toolbar-rgb),0.82))]",
        ghost:
          "text-foreground shadow-none [--button-border:rgba(var(--toolbar-border-rgb),0.08)] [--button-highlight:rgba(232,175,72,0.08)] [--button-core:linear-gradient(180deg,rgba(var(--toolbar-plate-rgb),0.54),rgba(var(--toolbar-rgb),0.44))]",
        destructive:
          "text-white [--button-border:rgba(248,113,113,0.28)] [--button-highlight:rgba(248,113,113,0.16)] [--button-core:linear-gradient(180deg,rgba(153,27,27,0.9),rgba(127,29,29,0.96))]",
        link:
          "border-transparent bg-transparent px-0 text-primary shadow-none backdrop-blur-none before:hidden after:hidden hover:underline underline-offset-4",
      },
      size: {
        default:
          "h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-full px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-full px-4 text-[0.84rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2.5 rounded-full px-6 text-[0.96rem] [&_svg:not([class*='size-'])]:size-4.5",
        icon: "size-10 rounded-[20px]",
        "icon-xs": "size-7 rounded-[14px] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-[16px]",
        "icon-lg": "size-12 rounded-[22px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  children,
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      <span className="button-chrome__content">{children}</span>
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
