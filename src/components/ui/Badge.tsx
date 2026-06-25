import { cn } from "@/lib/utils";

type BadgeType = "best-seller" | "new" | "sale" | "limited";

interface BadgeProps {
  type?: BadgeType;
  variant?: BadgeType;
  className?: string;
  children?: React.ReactNode;
}

const badgeStyles: Record<BadgeType, string> = {
  "best-seller": "bg-accent-100 text-accent-800 border-accent-300",
  new: "bg-primary-100 text-primary-800 border-primary-300",
  sale: "bg-red-100 text-red-800 border-red-300",
  limited: "bg-purple-100 text-purple-800 border-purple-300",
};

const badgeLabels: Record<BadgeType, string> = {
  "best-seller": "Best Seller",
  new: "New",
  sale: "Sale",
  limited: "Limited Edition",
};

function Badge({ type, variant, className, children }: BadgeProps) {
  const resolvedType = variant ?? type;
  if (!resolvedType || !badgeStyles[resolvedType]) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        badgeStyles[resolvedType],
        className
      )}
    >
      {children ?? badgeLabels[resolvedType]}
    </span>
  );
}

export { Badge };
export type { BadgeType };