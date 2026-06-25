import { cn } from "@/lib/utils";

interface StarsProps {
  rating: number | { toNumber(): number };
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

function StarIcon({ filled, half, className }: { filled: boolean; half: boolean; className?: string }) {
  if (half) {
    return (
      <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="halfGrad">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="#D1D5DB" />
          </linearGradient>
        </defs>
        <path
          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          fill={filled ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        fill={filled ? "currentColor" : "#D1D5DB"}
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

function Stars({ rating, maxRating = 5, size = "md", showValue = false, className }: StarsProps) {
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    const filled = i <= Math.floor(Number(rating));
    const half = !filled && i - 0.5 <= Number(rating);

    stars.push(
      <StarIcon
        key={i}
        filled={filled}
        half={half}
        className={cn(
          sizeMap[size],
          "text-accent-500",
          className
        )}
      />
    );
  }

  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${rating} out of ${maxRating} stars`}>
      {stars}
      {showValue && (
        <span className="ml-1 text-sm text-neutral-600">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
}

export { Stars };
export type { StarsProps };