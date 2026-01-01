import { NextResponse } from "next/server";
import { fetchPosts } from "@/lib/api";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("query");
	const page = Number.parseInt(searchParams.get("page") || "1", 10);

	if (!query) {
		return NextResponse.json(
			{ error: "Query parameter is required" },
			{ status: 400 },
		);
	}

	try {
		const results = await fetchPosts({
			search: query,
			per_page: 20,
			page,
		});

		return NextResponse.json(results);
	} catch (error) {
		console.error("Search API error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch search results" },
			{ status: 500 },
		);
	}
}
