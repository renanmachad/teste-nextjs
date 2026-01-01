"use client";
import { ToastProvider } from "./ui-native/toast";

export default function Providers({ children }: { children: React.ReactNode }) {
	return <ToastProvider>{children}</ToastProvider>;
}
