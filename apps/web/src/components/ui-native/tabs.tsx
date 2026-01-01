"use client";

import { type HTMLAttributes, createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
	value: string;
	onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
	const context = useContext(TabsContext);
	if (!context) {
		throw new Error("Tabs components must be used within a Tabs component");
	}
	return context;
}

interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
}

export function Tabs({ value: controlledValue, defaultValue, onValueChange, children, className, ...props }: TabsProps) {
	const [internalValue, setInternalValue] = useState(defaultValue || "");

	const value = controlledValue !== undefined ? controlledValue : internalValue;
	const setValue = onValueChange || setInternalValue;

	return (
		<TabsContext.Provider value={{ value, onValueChange: setValue }}>
			<div className={cn("w-full", className)} {...props}>
				{children}
			</div>
		</TabsContext.Provider>
	);
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
				className,
			)}
			{...props}
		/>
	);
}

interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
	value: string;
}

export function TabsTrigger({ value, className, ...props }: TabsTriggerProps) {
	const { value: selectedValue, onValueChange } = useTabsContext();
	const isActive = selectedValue === value;

	return (
		<button
			type="button"
			onClick={() => onValueChange(value)}
			className={cn(
				"inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300",
				isActive
					? "bg-white text-gray-950 shadow-sm dark:bg-gray-950 dark:text-gray-50"
					: "hover:bg-gray-200 dark:hover:bg-gray-700",
				className,
			)}
			{...props}
		/>
	);
}

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
	value: string;
}

export function TabsContent({ value, className, children, ...props }: TabsContentProps) {
	const { value: selectedValue } = useTabsContext();

	if (selectedValue !== value) {
		return null;
	}

	return (
		<div className={cn("mt-2", className)} {...props}>
			{children}
		</div>
	);
}
