import { cn } from "@/lib/utils";
import * as React from "react";

const QueryInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <div
      className={cn(
        "flex flex-row justify-between p-3 gap-2 h-fit items-center w-full rounded border border-input bg-background shadow-sm transition-colors file:border-0 file:bg-transparent focus-within:ring-[1.5px] focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      <input
        type={type}
        className={cn(
          "text-sm md:text-base placeholder:text-sm md:placeholder:text-base bg-transparent ml-2 w-full h-10 rounded file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:outline-none"
        )}
        ref={ref}
        {...props}
      />
      {/* <Button
        type="submit"
        className="aspect-square cursor-pointer h-10 rounded-xl"
      >
        <Search className="w-8 h-8" />
      </Button> */}
    </div>
  );
});
QueryInput.displayName = "QueryInput";

export { QueryInput };
