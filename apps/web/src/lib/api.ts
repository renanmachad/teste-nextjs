import { unstable_cache } from "next/cache";
import { env } from "@,/env/web";
import type { CNNPost, CNNPostsResponse, Post } from "./types";

export interface FetchPostsParams {
	per_page?: number;
	category?: string;
	tags?: string;
	search?: string;
	page?: number;
}

/**
 * Normalize a CNN Brasil API post to our app's Post type
 */
function normalizePost(cnnPost: CNNPost): Post {
	// Get primary category (API returns single category object)
	const primaryCategory = cnnPost.category || {
		id: "0",
		name: "Geral",
		slug: "geral",
		description: "",
		hidden: false,
		permalink: "",
	};

	// Extract content: handle both object format {type, raw} and string format
	const contentHtml =
		typeof cnnPost.content === "object" && cnnPost.content !== null
			? cnnPost.content.raw || ""
			: cnnPost.content || "";

	return {
		id: Number.parseInt(cnnPost.id, 10),
		slug: cnnPost.slug,
		title: cnnPost.title,
		excerpt: cnnPost.excerpt || "",
		content: contentHtml,
		published_at: cnnPost.publish_date,
		updated_at: cnnPost.modified_date,
		featured_image: cnnPost.featured_media?.image
			? {
					url: cnnPost.featured_media.image.url,
					width: 1024,
					height: 768,
					alt: cnnPost.featured_media.image.alt || cnnPost.title,
				}
			: undefined,
		category: {
			id: Number.parseInt(primaryCategory.id, 10),
			name: primaryCategory.name,
			slug: primaryCategory.slug,
			description: primaryCategory.description,
		},
		categories: cnnPost.category
			? [
					{
						id: Number.parseInt(primaryCategory.id, 10),
						name: primaryCategory.name,
						slug: primaryCategory.slug,
						description: primaryCategory.description,
					},
				]
			: undefined,
		author: {
			id: 0,
			name: cnnPost.author?.name || "CNN Brasil",
			slug: cnnPost.author?.slug || "cnn-brasil",
			avatar_url: cnnPost.author?.image?.url,
		},
		tags: cnnPost.tags?.map((tag) => tag.name),
		read_time: Math.ceil(contentHtml.length / 1000), // Rough estimate: 1000 chars = 1 min
	};
}

/**
 * Internal fetch function for posts
 */
async function fetchPostsInternal(params: FetchPostsParams = {}): Promise<Post[]> {
	const searchParams = new URLSearchParams();

	if (params.per_page) searchParams.set("per_page", String(params.per_page));
	if (params.category) searchParams.set("category", params.category);
	if (params.tags) searchParams.set("tags", params.tags);
	if (params.search) searchParams.set("search", params.search);
	if (params.page) searchParams.set("page", String(params.page));

	const url = `${env.API_BASE_URL}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

	try {
		const response = await fetch(url, {
			// Next.js automatic request deduplication
			// Multiple identical requests will be deduped within the same render
			cache: "force-cache",
		});

		if (!response.ok) {
			console.error(
				`Failed to fetch posts: ${response.status} ${response.statusText}`,
			);
			return [];
		}

		const data: CNNPostsResponse | CNNPost[] = await response.json();

		// Handle edge case: API returns empty array [] when category doesn't exist
		if (Array.isArray(data)) {
			if (data.length === 0) {
				return [];
			}
			// If it's an array of posts, normalize them directly
			return data.map(normalizePost);
		}

		// Normal case: API returns { page, max_pages, posts: [...] }
		if (!data.posts || !Array.isArray(data.posts)) {
			console.error("Invalid API response format:", data);
			return [];
		}

		// Normalize posts to our app's format
		return data.posts.map(normalizePost);
	} catch (error) {
		console.error("Error fetching posts:", error);
		return [];
	}
}

/**
 * Fetch posts from CNN Brasil API with intelligent caching
 * Uses Next.js unstable_cache for optimal performance and revalidation
 */
export async function fetchPosts(params: FetchPostsParams = {}): Promise<Post[]> {
	// Create a unique cache key based on params
	const cacheKey = `posts-${JSON.stringify(params)}`;

	// Determine revalidation time based on request type
	const revalidate = params.search
		? 30 // Search results: 30 seconds
		: params.page && params.page > 1
			? 60 // Paginated results: 1 minute
			: 60; // Homepage/listings: 1 minute

	// Use unstable_cache for better control over caching strategy
	const cachedFetch = unstable_cache(
		async () => fetchPostsInternal(params),
		[cacheKey],
		{
			revalidate,
			tags: [
				"posts",
				...(params.category ? [`category-${params.category}`] : []),
				...(params.search ? ["search"] : []),
			],
		},
	);

	return cachedFetch();
}

/**
 * Internal fetch function for single post
 */
async function fetchPostInternal(slug: string): Promise<Post | null> {
	const url = `${env.API_BASE_URL}/${slug}`;

	try {
		const response = await fetch(url, {
			cache: "force-cache",
		});

		if (!response.ok) {
			if (response.status === 404) {
				return null;
			}
			console.error(
				`Failed to fetch post: ${response.status} ${response.statusText}`,
			);
			return null;
		}

		const data: CNNPost = await response.json();
		return normalizePost(data);
	} catch (error) {
		console.error(`Error fetching post ${slug}:`, error);
		return null;
	}
}

/**
 * Fetch a single post by slug with extended caching
 * Articles change less frequently, so we use 5-minute revalidation
 */
export async function fetchPost(slug: string): Promise<Post | null> {
	const cachedFetch = unstable_cache(
		async () => fetchPostInternal(slug),
		[`post-${slug}`],
		{
			revalidate: 300, // 5 minutes - articles don't change often
			tags: ["posts", `post-${slug}`],
		},
	);

	return cachedFetch();
}
