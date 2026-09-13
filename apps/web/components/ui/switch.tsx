"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      disabled,
      onClick,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
    const isChecked = controlledChecked !== undefined ? controlledChecked : uncontrolledChecked;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const next = !isChecked;
      if (controlledChecked === undefined) {
        setUncontrolledChecked(next);
      }
      onCheckedChange?.(next);
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
      }
    };

    return (
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        data-state={isChecked ? "checked" : "unchecked"}
        ref={ref}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isChecked ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-slate-800",
          className,
        )}
        {...props}
      >
        <span
          data-state={isChecked ? "checked" : "unchecked"}
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-slate-50 shadow-lg ring-0 transition-transform duration-200",
            isChecked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>
    );
  },
);

Switch.displayName = "Switch";

export { Switch };
