"use client";

import { LayoutGrid } from "lucide-react";
import { useLayoutPreference } from "@/hooks/use-layout-preference";
import type { Post } from "@/lib/types";
import { LayoutA } from "./layouts/layout-a";
import { LayoutB } from "./layouts/layout-b";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

interface HomeContentProps {
	politicaPosts: Post[];
	economiaPosts: Post[];
}

export function HomeContent({
	politicaPosts,
	economiaPosts,
}: HomeContentProps) {
	const { layout, updateLayout, isLoading } = useLayoutPreference();

	// Select posts based on current layout
	const posts = layout === "layout-a" ? politicaPosts : economiaPosts;

	if (isLoading) {
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
		<div>
			{/* Layout Toggle - Visible only in development/admin */}
			<div className="border-b bg-muted/50 py-2">
				<div className="container mx-auto flex items-center justify-between px-4">
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<LayoutGrid className="h-4 w-4" />
						<span>
							Layout atual: {layout === "layout-a" ? "Política" : "Economia"}
						</span>
					</div>
					<div className="flex gap-2">
						<Button
							size="sm"
							variant={layout === "layout-a" ? "default" : "outline"}
							onClick={() => updateLayout("layout-a")}
						>
							Layout A
						</Button>
						<Button
							size="sm"
							variant={layout === "layout-b" ? "default" : "outline"}
							onClick={() => updateLayout("layout-b")}
						>
							Layout B
						</Button>
					</div>
				</div>
			</div>

			{/* Render selected layout */}
			{layout === "layout-a" ? (
				<LayoutA posts={posts} />
			) : (
				<LayoutB posts={posts} />
			)}
		</div>
	);
}
