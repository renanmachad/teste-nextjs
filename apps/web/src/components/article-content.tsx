"use client";

import { useMemo } from "react";
import {
	parseShortcodes,
	type Shortcode,
	splitContentByShortcodes,
} from "@/lib/shortcodes";
import { ReadToo } from "./read-too";

interface ArticleContentProps {
	content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
	// Parse shortcodes and get processed content
	const { content: processedContent, shortcodes } = useMemo(
		() => parseShortcodes(content),
		[content],
	);

	// Split content into parts
	const contentParts = useMemo(
		() => splitContentByShortcodes(processedContent),
		[processedContent],
	);

	return (
		<div className="article-content">
			{contentParts.map((part, index) => {
				if (part.type === "html") {
					return (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: Content parts order is stable
							key={`html-${index}`}
							className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-lg prose-headings:font-bold prose-strong:font-semibold prose-a:text-primary prose-headings:text-foreground prose-li:text-foreground prose-ol:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-p:leading-relaxed prose-a:no-underline hover:prose-a:underline"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: Content is from trusted API
							dangerouslySetInnerHTML={{ __html: part.content }}
						/>
					);
				}

				// Render shortcode component
				const shortcode = shortcodes.get(part.content);
				if (!shortcode) {
					return null;
				}

				return (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: Content parts order is stable
						key={`shortcode-${index}`}
					>
						{renderShortcode(shortcode, index)}
					</div>
				);
			})}
		</div>
	);
}

/**
 * Render shortcode component based on type
 */
function renderShortcode(shortcode: Shortcode, key: number) {
	switch (shortcode.type) {
		case "read_too":
			return <ReadToo key={key} shortcode={shortcode} />;
		default:
			return null;
	}
}
