"use client";

import { useLayoutPreference } from "@/hooks/use-layout-preference";
import type { LayoutType, Post } from "@/lib/types";
import { LayoutA } from "./layouts/layout-a";
import { LayoutB } from "./layouts/layout-b";
import { Skeleton } from "./ui/skeleton";

interface HomeContentProps {
	politicaPosts: Post[];
	economiaPosts: Post[];
	initialLayout?: LayoutType;
}

export function HomeContent({
	politicaPosts,
	economiaPosts,
	initialLayout,
}: HomeContentProps) {
	const { layout, isLoading } = useLayoutPreference();
	
	// Use initialLayout from server if hook is still loading
	const currentLayout = isLoading && initialLayout ? initialLayout : layout;

	// Select posts based on current layout
	const posts = currentLayout === "layout-a" ? politicaPosts : economiaPosts;

	if (isLoading && !initialLayout) {
		return (
			<div className="container mx-auto px-4 py-6">
				<div className="space-y-4">
					<Skeleton className="h-96 w-full" />
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						<Skeleton className="h-64" />
						<Skeleton className="h-64" />
						<Skeleton className="h-64" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			{/* Render selected layout */}
			{currentLayout === "layout-a" ? (
				<LayoutA posts={posts} />
			) : (
				<LayoutB posts={posts} />
			)}
		</>
	);
}
