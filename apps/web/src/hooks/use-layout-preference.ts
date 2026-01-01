"use client";

import { useEffect, useState } from "react";
import { getLayoutCookieClient } from "@/lib/cookies-client";
import { getAuthToken } from "@/lib/auth";
import type { LayoutType } from "@/lib/types";

const DEFAULT_LAYOUT: LayoutType = "layout-a";

export function useLayoutPreference() {
	const [layout, setLayout] = useState<LayoutType>(DEFAULT_LAYOUT);
	const [isLoading, setIsLoading] = useState(true);

	// Load layout preference from cookie on mount
	useEffect(() => {
		try {
			const stored = getLayoutCookieClient();
			if (stored) {
				setLayout(stored);
			}
		} catch (error) {
			console.error("Failed to load layout preference:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Save layout preference via API route (which sets cookie)
	const updateLayout = async (newLayout: LayoutType) => {
		try {
			const token = getAuthToken();
			if (!token) {
				throw new Error("Not authenticated");
			}

			const response = await fetch("/api/admin/layout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ layout: newLayout }),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to update layout");
			}

			setLayout(newLayout);
		} catch (error) {
			console.error("Failed to save layout preference:", error);
			throw error;
		}
	};

	return {
		layout,
		updateLayout,
		isLoading,
	};
}
