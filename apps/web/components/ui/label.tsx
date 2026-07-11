import * as React from "react";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`text-sm font-medium text-slate-700 select-none transition-colors duration-150 ${className}`}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

export { Label };
