import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui-native/badge";
import { Card } from "@/components/ui-native/card";
import { Separator } from "@/components/ui-native/separator";
import type { Post } from "@/lib/types";

interface LayoutAProps {
	posts: Post[];
}

export function LayoutA({ posts }: LayoutAProps) {
	const [heroPost, ...otherPosts] = posts;
	const secondaryPosts = otherPosts.slice(0, 6);
	const sidebarPosts = otherPosts.slice(6, 12);

	if (!heroPost) {
		return (
			<div className="container mx-auto px-4 py-8">
				<p className="text-center text-muted-foreground">
					Nenhuma notícia disponível
				</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-6">
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
				{/* Main Content */}
				<div className="lg:col-span-8">
					{/* Hero Article */}
					<Link
						href={`/${heroPost.category.slug}/${heroPost.slug}` as any}
						className="group mb-8 block"
					>
						<Card className="overflow-hidden border-none shadow-lg transition-shadow hover:shadow-xl">
							{heroPost.featured_image && (
								<div className="relative aspect-[16/9] w-full overflow-hidden">
									<Image
										src={heroPost.featured_image.url}
										alt={heroPost.featured_image.alt || heroPost.title}
										fill
										className="object-cover transition-transform duration-300 group-hover:scale-105"
										priority
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
									<div className="absolute right-0 bottom-0 left-0 p-6">
										<Badge variant="default" className="mb-3">
											{heroPost.category.name}
										</Badge>
										<h1 className="mb-2 line-clamp-3 font-bold text-2xl text-white md:text-3xl lg:text-4xl">
											{heroPost.title}
										</h1>
										{heroPost.excerpt && (
											<p className="line-clamp-2 text-sm text-white/90 md:text-base">
												{heroPost.excerpt}
											</p>
										)}
									</div>
								</div>
							)}
						</Card>
					</Link>

					{/* Secondary Articles Grid */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{secondaryPosts.map((post) => (
							<Link
								key={post.id}
								href={`/${post.category.slug}/${post.slug}` as any}
								className="group"
							>
								<Card className="h-full overflow-hidden border transition-shadow hover:shadow-md">
									{post.featured_image && (
										<div className="relative aspect-[16/10] w-full overflow-hidden">
											<Image
												src={post.featured_image.url}
												alt={post.featured_image.alt || post.title}
												fill
												className="object-cover transition-transform duration-300 group-hover:scale-105"
											/>
										</div>
									)}
									<div className="p-4">
										<Badge variant="outline" className="mb-2">
											{post.category.name}
										</Badge>
										<h3 className="mb-2 line-clamp-2 font-semibold text-base transition-colors group-hover:text-primary">
											{post.title}
										</h3>
										{post.excerpt && (
											<p className="line-clamp-2 text-muted-foreground text-sm">
												{post.excerpt}
											</p>
										)}
										<div className="mt-3 flex items-center gap-2 text-muted-foreground text-xs">
											<time dateTime={post.published_at}>
												{new Date(post.published_at).toLocaleDateString(
													"pt-BR",
													{
														day: "2-digit",
														month: "2-digit",
														year: "numeric",
													},
												)}
											</time>
											{post.read_time && <span>• {post.read_time} min</span>}
										</div>
									</div>
								</Card>
							</Link>
						))}
					</div>
				</div>

				{/* Sidebar */}
				<aside className="lg:col-span-4">
					<div className="sticky top-6">
						<div className="mb-6">
							<h2 className="mb-4 flex items-center gap-2 font-bold text-lg">
								Últimas Notícias
								<Separator className="flex-1" />
							</h2>
							<div className="space-y-4">
								{sidebarPosts.map((post, index) => (
									<Link
										key={post.id}
										href={`/${post.category.slug}/${post.slug}` as any}
										className="group block"
									>
										<div className="flex gap-3">
											<div className="flex-shrink-0">
												<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-sm">
													{index + 1}
												</span>
											</div>
											<div className="min-w-0 flex-1">
												<h4 className="mb-1 line-clamp-3 font-semibold text-sm transition-colors group-hover:text-primary">
													{post.title}
												</h4>
												<time
													className="text-muted-foreground text-xs"
													dateTime={post.published_at}
												>
													{new Date(post.published_at).toLocaleDateString(
														"pt-BR",
														{
															day: "2-digit",
															month: "2-digit",
															hour: "2-digit",
															minute: "2-digit",
														},
													)}
												</time>
											</div>
										</div>
										{index < sidebarPosts.length - 1 && (
											<Separator className="my-3" />
										)}
									</Link>
								))}
							</div>
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
}
