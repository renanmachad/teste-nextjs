"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Toast {
	id: string;
	message: string;
	type: "success" | "error" | "info";
}

interface ToastContextValue {
	showToast: (message: string, type: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within ToastProvider");
	}
	return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const showToast = useCallback((message: string, type: Toast["type"]) => {
		const id = Math.random().toString(36).substring(7);
		setToasts((prev) => [...prev, { id, message, type }]);

		// Auto-dismiss after 3 seconds
		setTimeout(() => {
			setToasts((prev) => prev.filter((toast) => toast.id !== id));
		}, 3000);
	}, []);

	const dismissToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
				{toasts.map((toast) => (
					<div
						key={toast.id}
						onClick={() => dismissToast(toast.id)}
						className={cn(
							"pointer-events-auto min-w-[300px] cursor-pointer rounded-lg px-4 py-3 shadow-lg transition-all animate-in slide-in-from-right-full",
							{
								"bg-green-600 text-white": toast.type === "success",
								"bg-red-600 text-white": toast.type === "error",
								"bg-blue-600 text-white": toast.type === "info",
							},
						)}
					>
						<p className="text-sm font-medium">{toast.message}</p>
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}

// Helper functions for easier usage
export const toast = {
	success: (message: string) => {
		if (typeof window !== "undefined") {
			window.dispatchEvent(
				new CustomEvent("show-toast", {
					detail: { message, type: "success" },
				}),
			);
		}
	},
	error: (message: string) => {
		if (typeof window !== "undefined") {
			window.dispatchEvent(
				new CustomEvent("show-toast", {
					detail: { message, type: "error" },
				}),
			);
		}
	},
	info: (message: string) => {
		if (typeof window !== "undefined") {
			window.dispatchEvent(
				new CustomEvent("show-toast", {
					detail: { message, type: "info" },
				}),
			);
		}
	},
};
