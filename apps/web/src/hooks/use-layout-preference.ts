"use client";

import { useEffect, useState } from "react";
import type { LayoutType } from "@/lib/types";

const LAYOUT_STORAGE_KEY = "cnn-layout-preference";
const DEFAULT_LAYOUT: LayoutType = "layout-a";

export function useLayoutPreference() {
	const [layout, setLayout] = useState<LayoutType>(DEFAULT_LAYOUT);
	const [isLoading, setIsLoading] = useState(true);

	// Load layout preference from localStorage on mount
	useEffect(() => {
		try {
			const stored = localStorage.getItem(LAYOUT_STORAGE_KEY);
			if (stored === "layout-a" || stored === "layout-b") {
				setLayout(stored);
			}
		} catch (error) {
			console.error("Failed to load layout preference:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Save layout preference to localStorage
	const updateLayout = (newLayout: LayoutType) => {
		try {
			localStorage.setItem(LAYOUT_STORAGE_KEY, newLayout);
			setLayout(newLayout);
		} catch (error) {
			console.error("Failed to save layout preference:", error);
		}
	};

	return {
		layout,
		updateLayout,
		isLoading,
	};
}
