import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "dark" | "lime" | "secondary" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap transition-[background-color,color,box-shadow,transform,border-color] duration-150 disabled:opacity-55 disabled:pointer-events-none active:translate-y-px select-none";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-700 shadow-[0_1px_0_rgb(255_255_255/0.2)_inset,0_8px_20px_-10px_rgb(81_70_229/0.8)]",
  dark: "bg-ink text-white hover:bg-ink-2",
  lime: "bg-lime text-ink hover:bg-[#c9ea55]",
  secondary: "bg-white text-ink border border-line hover:border-line-strong hover:bg-mist/60",
  ghost: "text-ink hover:bg-ink/5",
  link: "text-brand hover:text-brand-700 underline-offset-4 hover:underline px-0! h-auto!",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-lg",
  md: "h-11 px-5 text-[15px] rounded-xl",
  lg: "h-13 px-6 text-base rounded-xl",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, type = "button", ...props },
  ref,
) {
  return <button ref={ref} type={type} className={buttonClasses(variant, size, className)} {...props} />;
});

type LinkButtonProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

export function LinkButton({ variant = "primary", size = "md", className, ...props }: LinkButtonProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}
