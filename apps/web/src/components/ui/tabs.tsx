import * as React from "react";

import { cn } from "@/lib/utils";

const TabsContext = React.createContext<{
	value: string;
	onValueChange: (value: string) => void;
} | null>(null);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
	defaultValue?: string;
	value?: string;
	onValueChange?: (value: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
	({ className, defaultValue, value, onValueChange, ...props }, ref) => {
		const [internalValue, setInternalValue] = React.useState(
			defaultValue || "",
		);
		const currentValue = value !== undefined ? value : internalValue;
		const handleValueChange =
			onValueChange !== undefined ? onValueChange : setInternalValue;

		return (
			<TabsContext.Provider
				value={{ value: currentValue, onValueChange: handleValueChange }}
			>
				<div ref={ref} className={cn("w-full", className)} {...props} />
			</TabsContext.Provider>
		);
	},
);
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		role="tablist"
		className={cn(
			"inline-flex h-9 items-center justify-center rounded-none bg-muted p-1 text-muted-foreground",
			className,
		)}
		{...props}
	/>
));
TabsList.displayName = "TabsList";

export interface TabsTriggerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
	({ className, value, ...props }, ref) => {
		const context = React.useContext(TabsContext);
		if (!context) {
			throw new Error("TabsTrigger must be used within Tabs");
		}

		const isSelected = context.value === value;

		return (
			<button
				ref={ref}
				type="button"
				role="tab"
				aria-selected={isSelected}
				onClick={() => context.onValueChange(value)}
				className={cn(
					"inline-flex items-center justify-center whitespace-nowrap rounded-none px-3 py-1 font-medium text-xs ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
					isSelected
						? "bg-background text-foreground shadow"
						: "hover:bg-background/50",
					className,
				)}
				{...props}
			/>
		);
	},
);
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
	({ className, value, ...props }, ref) => {
		const context = React.useContext(TabsContext);
		if (!context) {
			throw new Error("TabsContent must be used within Tabs");
		}

		if (context.value !== value) {
			return null;
		}

		return (
			<div
				ref={ref}
				role="tabpanel"
				className={cn(
					"mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
					className,
				)}
				{...props}
			/>
		);
	},
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
