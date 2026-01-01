import { cookies } from "next/headers";
import type { LayoutType } from "@/lib/types";

const LAYOUT_COOKIE_NAME = "cnn-layout-preference";
const LAYOUT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

/**
 * Server-side: Get layout preference from cookie
 */
export async function getLayoutCookie(): Promise<LayoutType | null> {
	const cookieStore = await cookies();
	const layout = cookieStore.get(LAYOUT_COOKIE_NAME)?.value;

	if (layout === "layout-a" || layout === "layout-b") {
		return layout;
	}

	return null;
}

/**
 * Server-side: Set layout preference cookie
 */
export async function setLayoutCookie(layout: LayoutType): Promise<void> {
	const cookieStore = await cookies();
	cookieStore.set(LAYOUT_COOKIE_NAME, layout, {
		maxAge: LAYOUT_COOKIE_MAX_AGE,
		httpOnly: false, // Allow client-side reading for hydration
		sameSite: "lax",
		path: "/",
	});
}

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
