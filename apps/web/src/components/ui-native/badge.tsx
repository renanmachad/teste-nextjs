import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
	variant?: "default" | "secondary" | "outline";
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
	({ className, variant = "default", ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
					{
						"border-transparent bg-blue-600 text-white hover:bg-blue-700":
							variant === "default",
						"border-transparent bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100":
							variant === "secondary",
						"border-gray-300 bg-transparent text-gray-900 dark:border-gray-600 dark:text-gray-100":
							variant === "outline",
					},
					className,
				)}
				{...props}
			/>
		);
	},
);

Badge.displayName = "Badge";
