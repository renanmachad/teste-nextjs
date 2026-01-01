import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui-native/badge";
import { Card } from "@/components/ui-native/card";
import { Separator } from "@/components/ui-native/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui-native/tabs";
import type { Post } from "@/lib/types";

interface LayoutBProps {
	posts: Post[];
}

export function LayoutB({ posts }: LayoutBProps) {
	const [heroPost, ...otherPosts] = posts;
	const gridPosts = otherPosts.slice(0, 8);
	const tabsPosts = {
		recent: otherPosts.slice(8, 14),
		popular: otherPosts.slice(14, 20),
	};

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
			{/* Hero Section with Overlay */}
			<div className="mb-8">
				<Link
					href={`/${heroPost.category.slug}/${heroPost.slug}` as any}
					className="group block"
				>
					<Card className="relative overflow-hidden border-none shadow-xl">
						{heroPost.featured_image && (
							<div className="relative aspect-[21/9] w-full overflow-hidden">
								<Image
									src={heroPost.featured_image.url}
									alt={heroPost.featured_image.alt || heroPost.title}
									fill
									className="object-cover transition-transform duration-500 group-hover:scale-105"
									priority
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
								<div className="absolute right-0 bottom-0 left-0 max-w-4xl p-8">
									<Badge
										variant="default"
										className="mb-4 bg-teal-500 text-white hover:bg-teal-600"
									>
										{heroPost.category.name}
									</Badge>
									<h1 className="mb-4 line-clamp-2 font-bold text-3xl text-white md:text-4xl lg:text-5xl">
										{heroPost.title}
									</h1>
									{heroPost.excerpt && (
										<p className="line-clamp-2 max-w-3xl text-base text-white/95 md:text-lg">
											{heroPost.excerpt}
										</p>
									)}
									<div className="mt-4 flex items-center gap-3 text-sm text-white/80">
										<time dateTime={heroPost.published_at}>
											{new Date(heroPost.published_at).toLocaleDateString(
												"pt-BR",
												{
													day: "2-digit",
													month: "long",
													year: "numeric",
												},
											)}
										</time>
										{heroPost.author && <span>• {heroPost.author.name}</span>}
									</div>
								</div>
							</div>
						)}
					</Card>
				</Link>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
				{/* Main Content - 3 Column Grid */}
				<div className="lg:col-span-9">
					<div className="mb-6 flex items-center gap-3">
						<h2 className="font-bold text-xl">Principais Notícias</h2>
						<Separator className="flex-1" />
					</div>

					<div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{gridPosts.map((post) => (
							<Link
								key={post.id}
								href={`/${post.category.slug}/${post.slug}` as any}
								className="group"
							>
								<Card className="h-full overflow-hidden border transition-all hover:shadow-lg">
									{post.featured_image && (
										<div className="relative aspect-[4/3] w-full overflow-hidden">
											<Image
												src={post.featured_image.url}
												alt={post.featured_image.alt || post.title}
												fill
												className="object-cover transition-transform duration-300 group-hover:scale-110"
											/>
										</div>
									)}
									<div className="p-4">
										<Badge variant="outline" className="mb-2 text-xs">
											{post.category.name}
										</Badge>
										<h3 className="mb-2 line-clamp-3 font-bold text-sm transition-colors group-hover:text-teal-600">
											{post.title}
										</h3>
										<time
											className="text-muted-foreground text-xs"
											dateTime={post.published_at}
										>
											{new Date(post.published_at).toLocaleDateString("pt-BR", {
												day: "2-digit",
												month: "short",
												hour: "2-digit",
												minute: "2-digit",
											})}
										</time>
									</div>
								</Card>
							</Link>
						))}
					</div>
				</div>

				{/* Sidebar with Tabs */}
				<aside className="lg:col-span-3">
					<div className="sticky top-6">
						<Tabs defaultValue="recent" className="w-full">
							<TabsList className="mb-4 grid w-full grid-cols-2">
								<TabsTrigger value="recent">Recentes</TabsTrigger>
								<TabsTrigger value="popular">Populares</TabsTrigger>
							</TabsList>

							<TabsContent value="recent" className="mt-0 space-y-4">
								{tabsPosts.recent.map((post) => (
									<Link
										key={post.id}
										href={`/${post.category.slug}/${post.slug}` as any}
										className="group block"
									>
										<div className="flex gap-3">
											{post.featured_image && (
												<div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded">
													<Image
														src={post.featured_image.url}
														alt={post.featured_image.alt || post.title}
														fill
														className="object-cover transition-transform group-hover:scale-105"
													/>
												</div>
											)}
											<div className="min-w-0 flex-1">
												<h4 className="mb-1 line-clamp-3 font-semibold text-sm transition-colors group-hover:text-teal-600">
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
										<Separator className="mt-4" />
									</Link>
								))}
							</TabsContent>

							<TabsContent value="popular" className="mt-0 space-y-4">
								{tabsPosts.popular.map((post, index) => (
									<Link
										key={post.id}
										href={`/${post.category.slug}/${post.slug}` as any}
										className="group block"
									>
										<div className="flex gap-3">
											<div className="flex-shrink-0">
												<span className="inline-flex h-8 w-8 items-center justify-center rounded bg-teal-500 font-bold text-sm text-white">
													{index + 1}
												</span>
											</div>
											<div className="min-w-0 flex-1">
												<h4 className="mb-1 line-clamp-3 font-semibold text-sm transition-colors group-hover:text-teal-600">
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
														},
													)}
												</time>
											</div>
										</div>
										{index < tabsPosts.popular.length - 1 && (
											<Separator className="mt-4" />
										)}
									</Link>
								))}
							</TabsContent>
						</Tabs>
					</div>
				</aside>
			</div>
		</div>
	);
}
