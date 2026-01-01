"use client";

import { Clock, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQueryParam } from "@/hooks/use-query-param";
import { Badge } from "@/components/ui-native/badge";
import type { Post } from "@/lib/types";
import { Pagination } from "./pagination";

interface SearchResultsProps {
	query: string;
	results: Post[];
	currentPage: number;
	totalResults: number;
	trendingPosts?: Post[];
}

export function SearchResults({
	query,
	results,
	currentPage,
	totalResults,
	trendingPosts = [],
}: SearchResultsProps) {
	const [searchQuery] = useQueryParam("search");

	if (results.length === 0) {
		return (
			<div className="container mx-auto px-4 py-12 text-center">
				<div className="mx-auto max-w-md space-y-4">
					<Search className="mx-auto h-16 w-16 text-muted-foreground" />
					<h2 className="font-bold text-2xl">Nenhum resultado encontrado</h2>
					<p className="text-muted-foreground">
						Sua busca por &quot;{query}&quot; não retornou resultados. Tente
						outros termos.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-6">
			{/* Search Header */}
			<div className="mb-6">
				<h1 className="mb-2 font-bold text-2xl md:text-3xl">
					Resultados da busca
				</h1>
				<p className="text-muted-foreground text-sm md:text-base">
					Exibindo resultados para &quot;{searchQuery || query}&quot;
				</p>
			</div>

			{/* Two Column Layout */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
				{/* Main Content (9/12) */}
				<div className="lg:col-span-9">
					{/* Results List */}
					<div className="divide-y">
						{results.map((post) => (
							<article key={post.id} className="py-4 first:pt-0">
								<Link
									href={`/${post.category.slug}/${post.slug}`}
									className="group block"
								>
									{/* Desktop: Horizontal, Mobile: Vertical */}
									<div className="flex flex-col gap-4 sm:flex-row">
										{/* Image */}
										{post.featured_image && (
											<div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg sm:w-48 md:w-56">
												<Image
													src={post.featured_image.url}
													alt={post.featured_image.alt || post.title}
													fill
													className="object-cover transition-transform duration-300 group-hover:scale-105"
													sizes="(max-width: 640px) 100vw, (max-width: 1024px) 192px, 224px"
												/>
											</div>
										)}

										{/* Content */}
										<div className="flex flex-1 flex-col gap-2">
											{/* Category Badge */}
											<Badge
												variant="secondary"
												className="w-fit font-medium text-xs"
											>
												{post.category.name}
											</Badge>

											{/* Title */}
											<h2 className="font-bold text-lg leading-tight transition-colors group-hover:underline md:text-xl">
												{post.title}
											</h2>

											{/* Timestamp */}
											{post.published_at && (
												<div className="flex items-center gap-1 text-muted-foreground text-sm">
													<Clock className="h-4 w-4" />
													<time dateTime={post.published_at}>
														{new Date(post.published_at).toLocaleDateString(
															"pt-BR",
															{
																day: "2-digit",
																month: "long",
																year: "numeric",
																hour: "2-digit",
																minute: "2-digit",
															},
														)}
													</time>
												</div>
											)}
										</div>
									</div>
								</Link>
							</article>
						))}
					</div>

					{/* Pagination */}
					<div className="mt-8">
						<Pagination
							currentPage={currentPage}
							totalResults={totalResults}
							resultsPerPage={20}
						/>
					</div>
				</div>

				{/* Sidebar (3/12) - Mais Lidas */}
				<aside className="lg:col-span-3">
					<div className="sticky top-4 space-y-4">
						<h3 className="border-b pb-2 font-bold text-lg">Mais Lidas</h3>

						{trendingPosts.length > 0 ? (
							<div className="space-y-4">
								{trendingPosts.map((post, index) => (
									<Link
										key={post.id}
										href={`/${post.category.slug}/${post.slug}`}
										className="group block"
									>
										<article className="flex gap-3">
											{/* Ranking Number */}
											<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-sm">
												{index + 1}
											</div>

											{/* Content */}
											<div className="flex-1 space-y-1">
												<Badge
													variant="outline"
													className="font-normal text-xs"
												>
													{post.category.name}
												</Badge>
												<h4 className="line-clamp-3 font-semibold text-sm leading-tight transition-colors group-hover:text-primary">
													{post.title}
												</h4>
											</div>
										</article>
									</Link>
								))}
							</div>
						) : (
							<p className="text-muted-foreground text-sm">
								Carregando posts em alta...
							</p>
						)}
					</div>
				</aside>
			</div>
		</div>
	);
}
