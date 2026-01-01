import { Calendar, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { ArticleContent } from "./article-content";
import { Breadcrumb } from "./breadcrumb";
import { Badge } from "./ui-native/badge";
import { Card } from "./ui-native/card";
import { Separator } from "./ui-native/separator";

interface ArticlePageProps {
	post: Post;
	relatedPosts: Post[];
}

export function ArticlePage({ post, relatedPosts }: ArticlePageProps) {
	// Build breadcrumb items from categories
	const breadcrumbItems = [
		{
			label: post.category.name,
			href: `/${post.category.slug}`,
		},
		{
			label: post.title,
			href: `/${post.category.slug}/${post.slug}`,
		},
	];

	return (
		<div className="container mx-auto px-4 py-6">
			{/* Breadcrumb */}
			<Breadcrumb items={breadcrumbItems} />

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
				{/* Main Content */}
				<article className="lg:col-span-8">
					{/* Article Header */}
					<header className="mb-6">
						<Badge variant="default" className="mb-3">
							{post.category.name}
						</Badge>

						<h1 className="mb-4 font-bold text-3xl leading-tight md:text-4xl lg:text-5xl">
							{post.title}
						</h1>

						{post.excerpt && (
							<p className="mb-4 text-muted-foreground text-xl leading-relaxed">
								{post.excerpt}
							</p>
						)}

						{/* Article Metadata */}
						<div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
							<div className="flex items-center gap-2">
								<User className="h-4 w-4" />
								<span>{post.author.name}</span>
							</div>
							<Separator orientation="vertical" className="h-4" />
							<div className="flex items-center gap-2">
								<Calendar className="h-4 w-4" />
								<time dateTime={post.published_at}>
									{new Date(post.published_at).toLocaleDateString("pt-BR", {
										day: "2-digit",
										month: "long",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</time>
							</div>
							{post.read_time && post.read_time > 0 && (
								<>
									<Separator orientation="vertical" className="h-4" />
									<span>{post.read_time} min de leitura</span>
								</>
							)}
						</div>
					</header>

					{/* Featured Image */}
					{post.featured_image && (
						<figure className="mb-8">
							<div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
								<Image
									src={post.featured_image.url}
									alt={post.featured_image.alt || post.title}
									fill
									className="object-cover"
									priority
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
								/>
							</div>
							{post.featured_image.alt && (
								<figcaption className="mt-2 text-muted-foreground text-sm">
									{post.featured_image.alt}
								</figcaption>
							)}
						</figure>
					)}

					{/* Article Content */}
					<ArticleContent content={post.content} />

					{/* Tags */}
					{post.tags && post.tags.length > 0 && (
						<div className="mt-8 border-t pt-6">
							<h3 className="mb-3 font-semibold text-sm">Tags:</h3>
							<div className="flex flex-wrap gap-2">
								{post.tags.map((tag) => (
									<Badge key={tag} variant="secondary">
										{tag}
									</Badge>
								))}
							</div>
						</div>
					)}
				</article>

				{/* Sidebar */}
				<aside className="lg:col-span-4">
					<div className="sticky top-6">
						<h2 className="mb-4 font-bold text-lg">Leia mais</h2>

						<div className="space-y-4">
							{relatedPosts.map((relatedPost) => (
								<Link
									key={relatedPost.id}
									href={
										`/${relatedPost.category.slug}/${relatedPost.slug}` as any
									}
									className="group block"
								>
									<Card className="overflow-hidden border transition-shadow hover:shadow-md">
										<div className="flex gap-3">
											{relatedPost.featured_image && (
												<div className="relative h-24 w-32 flex-shrink-0 overflow-hidden">
													<Image
														src={relatedPost.featured_image.url}
														alt={
															relatedPost.featured_image.alt ||
															relatedPost.title
														}
														fill
														className="object-cover transition-transform group-hover:scale-105"
														sizes="128px"
													/>
												</div>
											)}
											<div className="flex-1 p-3">
												<h3 className="mb-1 line-clamp-3 font-semibold text-sm transition-colors group-hover:text-primary">
													{relatedPost.title}
												</h3>
												<time
													className="text-muted-foreground text-xs"
													dateTime={relatedPost.published_at}
												>
													{new Date(
														relatedPost.published_at,
													).toLocaleDateString("pt-BR", {
														day: "2-digit",
														month: "2-digit",
														hour: "2-digit",
														minute: "2-digit",
													})}
												</time>
											</div>
										</div>
									</Card>
								</Link>
							))}
						</div>

						{relatedPosts.length === 0 && (
							<p className="text-center text-muted-foreground text-sm">
								Nenhum artigo relacionado encontrado
							</p>
						)}
					</div>
				</aside>
			</div>
		</div>
	);
}
