import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

interface SheetContextValue {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | null>(null);

export interface SheetProps {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: React.ReactNode;
}

const Sheet = ({
	open: controlledOpen,
	defaultOpen = false,
	onOpenChange,
	children,
}: SheetProps) => {
	const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
	const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
	const handleOpenChange =
		onOpenChange !== undefined ? onOpenChange : setInternalOpen;

	return (
		<SheetContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
			{children}
		</SheetContext.Provider>
	);
};

const SheetTrigger = React.forwardRef<
	HTMLButtonElement,
	React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, ...props }, ref) => {
	const context = React.useContext(SheetContext);
	if (!context) throw new Error("SheetTrigger must be used within Sheet");

	return (
		<button
			ref={ref}
			type="button"
			onClick={(e) => {
				context.onOpenChange(true);
				onClick?.(e);
			}}
			{...props}
		/>
	);
});
SheetTrigger.displayName = "SheetTrigger";

const SheetPortal = ({ children }: { children: React.ReactNode }) => {
	return typeof window !== "undefined"
		? createPortal(children, document.body)
		: null;
};

const SheetOverlay = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=open]:animate-in",
			className,
		)}
		{...props}
	/>
));
SheetOverlay.displayName = "SheetOverlay";

export interface SheetContentProps
	extends React.HTMLAttributes<HTMLDivElement> {
	side?: "top" | "right" | "bottom" | "left";
}

const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
	({ side = "right", className, children, ...props }, ref) => {
		const context = React.useContext(SheetContext);
		if (!context) throw new Error("SheetContent must be used within Sheet");

		if (!context.open) return null;

		const sideStyles = {
			top: "inset-x-0 top-0 border-b",
			bottom: "inset-x-0 bottom-0 border-t",
			left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
			right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
		};

		return (
			<SheetPortal>
				<SheetOverlay onClick={() => context.onOpenChange(false)} />
				<div
					ref={ref}
					data-state={context.open ? "open" : "closed"}
					className={cn(
						"fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:duration-300 data-[state=open]:duration-500",
						sideStyles[side],
						className,
					)}
					{...props}
				>
					{children}
				</div>
			</SheetPortal>
		);
	},
);
SheetContent.displayName = "SheetContent";

const SheetHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			"flex flex-col space-y-2 text-center sm:text-left",
			className,
		)}
		{...props}
	/>
);
SheetHeader.displayName = "SheetHeader";

const SheetTitle = React.forwardRef<
	HTMLHeadingElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h2
		ref={ref}
		className={cn("font-semibold text-foreground text-lg", className)}
		{...props}
	/>
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn("text-muted-foreground text-sm", className)}
		{...props}
	/>
));
SheetDescription.displayName = "SheetDescription";

export {
	Sheet,
	SheetTrigger,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
};
