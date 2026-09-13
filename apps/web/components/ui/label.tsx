import * as React from "react";
import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
