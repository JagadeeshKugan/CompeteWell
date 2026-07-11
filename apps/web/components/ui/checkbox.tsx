import * as React from "react";
import { Check } from "lucide-react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", checked, defaultChecked, onChange, onCheckedChange, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState<boolean>(
      checked !== undefined ? !!checked : (!!defaultChecked || false)
    );

    React.useEffect(() => {
      if (checked !== undefined) {
        setInternalChecked(!!checked);
      }
    }, [checked]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (checked === undefined) {
        setInternalChecked(e.target.checked);
      }
      if (onChange) {
        onChange(e);
      }
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
    };

    return (
      <div className="relative flex items-center justify-center select-none">
        <input
          type="checkbox"
          ref={ref}
          checked={internalChecked}
          onChange={handleChange}
          className="peer absolute h-5 w-5 opacity-0 cursor-pointer z-10"
          {...props}
        />
        <div
          className={`h-5 w-5 rounded-full border border-slate-300 bg-white flex items-center justify-center transition-all duration-150 peer-hover:border-slate-400 peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-focus-visible:ring-4 peer-focus-visible:ring-blue-500/10 peer-disabled:opacity-50 peer-disabled:bg-slate-100 ${className}`}
        >
          <Check className="h-3.5 w-3.5 text-white stroke-[3] scale-0 transition-transform duration-150 peer-checked:scale-100" />
        </div>
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
