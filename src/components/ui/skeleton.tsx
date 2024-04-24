import { cn } from "~/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  animate?: boolean;
}
function Skeleton({ className, animate = true, ...props }: Props) {
  return (
    <div
      className={cn(
        animate && "animate-pulse",
        "rounded-md bg-muted",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
