import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "outline" | "ghost";
	size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = "primary", size = "md", ...props }, ref) => {
		return (
			<button
				ref={ref}
				className={cn(
					"inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
					{
						// Variants
						"bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600":
							variant === "primary",
						"bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600":
							variant === "secondary",
						"border border-gray-300 bg-transparent hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800":
							variant === "outline",
						"hover:bg-gray-100 dark:hover:bg-gray-800": variant === "ghost",

						// Sizes
						"h-9 px-3 text-sm": size === "sm",
						"h-10 px-4 text-sm": size === "md",
						"h-11 px-6 text-base": size === "lg",
					},
					className,
				)}
				{...props}
			/>
		);
	},
);

Button.displayName = "Button";
