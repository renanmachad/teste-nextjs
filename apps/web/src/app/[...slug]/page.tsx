import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/article-page";
import { fetchPost, fetchPosts } from "@/lib/api";

interface ArticlePageProps {
	params: Promise<{
		slug: string[];
	}>;
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Article({ params }: ArticlePageProps) {
	const resolvedParams = await params;
	const slugArray = resolvedParams.slug;

	// The last segment is the article slug
	const articleSlug = slugArray[slugArray.length - 1];

	if (!articleSlug) {
		notFound();
	}

	// Fetch the article
	const post = await fetchPost(articleSlug);

	if (!post) {
		notFound();
	}

	// Fetch related articles from the same category
	const relatedPosts = await fetchPosts({
		category: post.category.slug,
		per_page: 10,
	});

	// Filter out the current article from related posts
	const filteredRelatedPosts = relatedPosts.filter((p) => p.id !== post.id);

	return (
		<ArticlePage post={post} relatedPosts={filteredRelatedPosts.slice(0, 6)} />
	);
}

export async function generateMetadata({ params }: ArticlePageProps) {
	const resolvedParams = await params;
	const slugArray = resolvedParams.slug;
	const articleSlug = slugArray[slugArray.length - 1];

	if (!articleSlug) {
		return {
			title: "Artigo não encontrado",
		};
	}

	const post = await fetchPost(articleSlug);

	if (!post) {
		return {
			title: "Artigo não encontrado",
		};
	}

	return {
		title: `${post.title} | CNN Brasil`,
		description: post.excerpt,
		openGraph: {
			title: post.title,
			description: post.excerpt,
			images: post.featured_image
				? [
						{
							url: post.featured_image.url,
							width: post.featured_image.width,
							height: post.featured_image.height,
							alt: post.featured_image.alt,
						},
					]
				: [],
		},
	};
}
