import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";
    
    let variantStyles = "";
    if (variant === "default") {
      variantStyles = "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/10";
    } else if (variant === "outline") {
      variantStyles = "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50";
    } else if (variant === "ghost") {
      variantStyles = "text-slate-700 hover:bg-slate-100 hover:text-slate-900";
    } else if (variant === "link") {
      variantStyles = "text-blue-600 underline-offset-4 hover:underline";
    }

    let sizeStyles = "";
    if (size === "default") {
      sizeStyles = "h-11 px-4 py-2";
    } else if (size === "sm") {
      sizeStyles = "h-9 rounded-lg px-3 text-xs";
    } else if (size === "lg") {
      sizeStyles = "h-12 rounded-xl px-8 text-base";
    } else if (size === "icon") {
      sizeStyles = "h-10 w-10 p-0";
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
