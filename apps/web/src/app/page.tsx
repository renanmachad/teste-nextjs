import { HomeContent } from "@/components/home-content";
import { SearchResults } from "@/components/search-results";
import { fetchPosts } from "@/lib/api";
import { getLayoutCookie } from "@/lib/cookies-server";
import type { LayoutType } from "@/lib/types";

export const revalidate = 60; // Revalidate every 60 seconds

interface PageProps {
	searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
	const { search, page } = await searchParams;

	// If there's a search query, show search results
	if (search) {
		const currentPage = Number.parseInt(page || "1", 10);

		// Fetch search results and trending posts in parallel
		const [searchResults, trendingPosts] = await Promise.all([
			fetchPosts({ search, per_page: 20, page: currentPage }),
			fetchPosts({ per_page: 5 }), // Get 5 most recent posts as "trending"
		]);

		// Estimate total results (since API doesn't provide total count)
		// If we get 20 results, assume there might be more pages
		const totalResults =
			searchResults.length === 20 ? currentPage * 20 + 20 : currentPage * 20;

		return (
			<SearchResults
				query={search}
				results={searchResults}
				currentPage={currentPage}
				totalResults={totalResults}
				trendingPosts={trendingPosts}
			/>
		);
	}

	// Otherwise, show normal homepage with layouts
	const [politicaPosts, economiaPosts, layoutPreference] = await Promise.all([
		fetchPosts({ category: "politica", per_page: 25 }),
		fetchPosts({ category: "economia", per_page: 25 }),
		getLayoutCookie(),
	]);

	const initialLayout: LayoutType = layoutPreference || "layout-a";

	return (
		<HomeContent
			politicaPosts={politicaPosts}
			economiaPosts={economiaPosts}
			initialLayout={initialLayout}
		/>
	);
}
