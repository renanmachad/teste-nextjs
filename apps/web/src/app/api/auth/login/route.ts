import { env } from "@,/env/web";
import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { username, password } = body;

		if (!username || !password) {
			return NextResponse.json(
				{ error: "Username and password are required" },
				{ status: 400 },
			);
		}

		// Validate credentials against environment variables
		if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 },
			);
		}

		// Generate a simple token (random string)
		const token = randomBytes(32).toString("hex");

		return NextResponse.json({ token, success: true });
	} catch (error) {
		console.error("Login API error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
