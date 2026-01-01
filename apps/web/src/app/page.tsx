import { HomeContent } from "@/components/home-content";
import { fetchPosts } from "@/lib/api";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
	// Fetch posts for both layouts
	// Layout A (Política) and Layout B (Economia)
	const [politicaPosts, economiaPosts] = await Promise.all([
		fetchPosts({ category: "politica", per_page: 25 }),
		fetchPosts({ category: "economia", per_page: 25 }),
	]);

	return (
		<HomeContent politicaPosts={politicaPosts} economiaPosts={economiaPosts} />
	);
}
