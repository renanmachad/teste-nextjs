import { NextResponse } from "next/server";
import { setLayoutCookie } from "@/lib/cookies";
import type { LayoutType } from "@/lib/types";

export async function POST(request: Request) {
	try {
		// Check authentication token from Authorization header or cookie
		const authHeader = request.headers.get("Authorization");
		const token = authHeader?.replace("Bearer ", "") || null;

		// For client-side requests, we'll validate the token exists
		// In a real app, you'd validate the token signature/expiry
		// For now, we just check that a token was provided
		if (!token) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		const body = await request.json();
		const { layout } = body;

		if (layout !== "layout-a" && layout !== "layout-b") {
			return NextResponse.json(
				{ error: "Invalid layout value" },
				{ status: 400 },
			);
		}

		await setLayoutCookie(layout as LayoutType);

		return NextResponse.json({ success: true, layout });
	} catch (error) {
		console.error("Layout API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
