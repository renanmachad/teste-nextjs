import type { LayoutType } from "@/lib/types";

const LAYOUT_COOKIE_NAME = "cnn-layout-preference";

/**
 * Client-side: Get layout preference from cookie
 */
export function getLayoutCookieClient(): LayoutType | null {
	if (typeof document === "undefined") {
		return null;
	}

	const cookies = document.cookie.split(";");
	const layoutCookie = cookies.find((cookie) =>
		cookie.trim().startsWith(`${LAYOUT_COOKIE_NAME}=`),
	);

	if (layoutCookie) {
		const value = layoutCookie.split("=")[1]?.trim();
		if (value === "layout-a" || value === "layout-b") {
			return value;
		}
	}

	return null;
}
