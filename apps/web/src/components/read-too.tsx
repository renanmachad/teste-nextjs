import { ArrowRight } from "lucide-react";
import Image from "next/image";
import type { ReadTooShortcode } from "@/lib/shortcodes";
import { Card } from "./ui-native/card";

interface ReadTooProps {
	shortcode: ReadTooShortcode;
}

export function ReadToo({ shortcode }: ReadTooProps) {
	const { displayImages, images, titles, ids } = shortcode;

	// Combine data into article objects
	const articles = titles.map((title, index) => ({
		id: ids[index] || "",
		title,
		image: displayImages && images[index] ? images[index] : null,
	}));

	if (articles.length === 0) {
		return null;
	}

	return (
		<div className="my-8 border-y bg-muted/30 py-6">
			<div className="mb-4 flex items-center gap-2">
				<h3 className="font-bold text-lg">Leia também</h3>
				<ArrowRight className="h-5 w-5 text-primary" />
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{articles.map((article, index) => (
					<Card
						key={article.id || index}
						className="group overflow-hidden transition-shadow hover:shadow-md"
					>
						{article.image && (
							<div className="relative aspect-[16/9] w-full overflow-hidden">
								<Image
									src={article.image}
									alt={article.title}
									fill
									className="object-cover transition-transform group-hover:scale-105"
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
								/>
							</div>
						)}
						<div className="p-4">
							<h4 className="line-clamp-3 font-semibold text-sm leading-snug transition-colors group-hover:text-primary">
								{article.title}
							</h4>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
