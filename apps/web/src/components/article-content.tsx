"use client";

import { useMemo } from "react";
import {
	parseShortcodes,
	type Shortcode,
} from "@/lib/shortcodes";
import { ReadToo } from "./read-too";

interface ArticleContentProps {
	content: string;
}

interface ContentPart {
	type: "html" | "iframe" | "shortcode";
	content: string;
	iframeUrl?: string;
}

/**
 * Convert YouTube URL to embed format
 * Supports:
 * - youtube.com/watch?v=VIDEO_ID
 * - youtu.be/VIDEO_ID
 * - youtube.com/embed/VIDEO_ID
 * - youtube.com/v/VIDEO_ID
 */
function convertYouTubeToEmbed(url: string): string | null {
	try {
		const urlObj = new URL(url);

		// Handle youtu.be short URLs
		if (urlObj.hostname === "youtu.be") {
			const videoId = urlObj.pathname.slice(1);
			if (videoId) {
				return `https://www.youtube.com/embed/${videoId}`;
			}
		}

		// Handle youtube.com URLs
		if (
			urlObj.hostname === "youtube.com" ||
			urlObj.hostname === "www.youtube.com" ||
			urlObj.hostname === "m.youtube.com"
		) {
			// Already an embed URL
			if (urlObj.pathname.startsWith("/embed/")) {
				return url;
			}

			// Extract video ID from watch URL
			const videoId = urlObj.searchParams.get("v");
			if (videoId) {
				return `https://www.youtube.com/embed/${videoId}`;
			}

			// Handle /v/ format
			const vMatch = urlObj.pathname.match(/^\/v\/([^/?]+)/);
			if (vMatch) {
				return `https://www.youtube.com/embed/${vMatch[1]}`;
			}
		}

		return null;
	} catch {
		return null;
	}
}

/**
 * Process HTML content and replace embeddable links (stories.cnnbrasil and YouTube) with iframe placeholders
 */
function processEmbedLinks(html: string): ContentPart[] {
	const parts: ContentPart[] = [];

	// Find all <a> tags with href containing our target domains
	// More flexible regex that handles spaces, newlines, and various quote styles
	const anchorTagRegex = /<a\s+[^>]*href\s*=\s*["']([^"']*(?:stories\.cnnbrasil|youtube\.com|youtu\.be)[^"']*)["'][^>]*>([^<]*)<\/a>/gis;

	const matches: Array<{
		url: string;
		fullMatch: string;
		index: number;
	}> = [];

	let match: RegExpExecArray | null;

	// Collect all matches first
	// biome-ignore lint/suspicious/noAssignInExpressions: Standard regex exec pattern
	while ((match = anchorTagRegex.exec(html)) !== null) {
		const url = match[1];
		if (
			url.includes("stories.cnnbrasil") ||
			url.includes("youtube.com") ||
			url.includes("youtu.be")
		) {
			matches.push({
				url,
				fullMatch: match[0],
				index: match.index,
			});
		}
	}

	// Also find direct URLs (not in <a> tags)
	const directUrlRegex = /(https?:\/\/[^\s<>"']*(?:stories\.cnnbrasil|youtube\.com|youtu\.be)[^\s<>"']*)/gi;

	// Reset lastIndex
	directUrlRegex.lastIndex = 0;

	// biome-ignore lint/suspicious/noAssignInExpressions: Standard regex exec pattern
	while ((match = directUrlRegex.exec(html)) !== null) {
		// Check if this URL is already inside an <a> tag
		const beforeMatch = html.slice(Math.max(0, match.index - 200), match.index);
		const afterMatch = html.slice(match.index, match.index + match[0].length + 200);

		// Check if URL is inside an <a> tag by looking for opening <a before and closing </a> after
		const hasOpeningTag = beforeMatch.includes("<a");
		const hasClosingTag = afterMatch.includes("</a>");
		const isInsideAnchorTag = hasOpeningTag && hasClosingTag;

		// Only add if it's NOT inside an <a> tag (already processed above)
		if (!isInsideAnchorTag) {
			matches.push({
				url: match[1],
				fullMatch: match[0],
				index: match.index,
			});
		}
	}

	// Remove duplicates (same index) and sort by index
	const uniqueMatches = matches.filter(
		(match, index, self) =>
			index === self.findIndex((m) => m.index === match.index),
	);
	uniqueMatches.sort((a, b) => a.index - b.index);

	let lastIndex = 0;
	let iframeIndex = 0;

	for (const matchData of uniqueMatches) {
		// Skip if this match overlaps with previous processing
		if (matchData.index < lastIndex) {
			continue;
		}

		// Add HTML content before the link
		if (matchData.index > lastIndex) {
			const htmlContent = html.slice(lastIndex, matchData.index);
			if (htmlContent.trim()) {
				parts.push({ type: "html", content: htmlContent });
			}
		}

		let embedUrl = matchData.url;

		// Ensure URL starts with http:// or https://
		if (!embedUrl.startsWith("http://") && !embedUrl.startsWith("https://")) {
			embedUrl = `https://${embedUrl}`;
		}

		// Convert YouTube URLs to embed format
		if (embedUrl.includes("youtube.com") || embedUrl.includes("youtu.be")) {
			const convertedUrl = convertYouTubeToEmbed(embedUrl);
			if (convertedUrl) {
				embedUrl = convertedUrl;
			} else {
				// If conversion failed, skip this match
				lastIndex = matchData.index + matchData.fullMatch.length;
				continue;
			}
		}

		// Add iframe placeholder
		const placeholder = `<!--IFRAME_${iframeIndex}-->`;
		parts.push({
			type: "iframe",
			content: placeholder,
			iframeUrl: embedUrl,
		});

		lastIndex = matchData.index + matchData.fullMatch.length;
		iframeIndex++;
	}

	// Add remaining HTML content
	if (lastIndex < html.length) {
		const htmlContent = html.slice(lastIndex);
		if (htmlContent.trim()) {
			parts.push({ type: "html", content: htmlContent });
		}
	}

	// If no embed links found, return the original HTML as a single part
	if (parts.length === 0) {
		return [{ type: "html", content: html }];
	}

	return parts;
}

/**
 * Split content parts that may contain iframes
 */
function splitContentWithIframes(
	html: string,
	shortcodes: Map<string, Shortcode>,
): ContentPart[] {
	const parts: ContentPart[] = [];
	const shortcodePlaceholderRegex = /<!--SHORTCODE_(\d+)-->/g;

	// First, process embed links (stories.cnnbrasil and YouTube)
	const embedParts = processEmbedLinks(html);

	// Then, process shortcodes within each part
	for (const embedPart of embedParts) {
		if (embedPart.type === "iframe") {
			// If it's an iframe, add it directly
			parts.push(embedPart);
		} else {
			// Process shortcodes in HTML parts
			const htmlContent = embedPart.content;
			let lastIndex = 0;
			let match: RegExpExecArray | null;

			// biome-ignore lint/suspicious/noAssignInExpressions: Standard regex exec pattern
			while ((match = shortcodePlaceholderRegex.exec(htmlContent)) !== null) {
				// Add HTML content before shortcode
				if (match.index > lastIndex) {
					const beforeHtml = htmlContent.slice(lastIndex, match.index);
					if (beforeHtml.trim()) {
						parts.push({ type: "html", content: beforeHtml });
					}
				}

				// Add shortcode placeholder
				parts.push({ type: "shortcode", content: match[0] });

				lastIndex = match.index + match[0].length;
			}

			// Add remaining HTML content
			if (lastIndex < htmlContent.length) {
				const remainingHtml = htmlContent.slice(lastIndex);
				if (remainingHtml.trim()) {
					parts.push({ type: "html", content: remainingHtml });
				}
			}
		}
	}

	return parts;
}

export function ArticleContent({ content }: ArticleContentProps) {
	// Parse shortcodes and get processed content
	const { content: processedContent, shortcodes } = useMemo(
		() => parseShortcodes(content),
		[content],
	);

	// Split content into parts (including iframes)
	const contentParts = useMemo(() => {
		const parts = splitContentWithIframes(processedContent, shortcodes);

		// Debug: log iframe parts
		if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
			const iframeParts = parts.filter((p) => p.type === "iframe");
			if (iframeParts.length > 0) {
				console.log("Found iframe parts:", iframeParts);
			}
		}

		return parts;
	}, [processedContent, shortcodes]);

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

				if (part.type === "iframe" && part.iframeUrl) {
					const isYouTube = part.iframeUrl.includes("youtube.com/embed");
					const isStories = part.iframeUrl.includes("stories.cnnbrasil");

					return (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: Content parts order is stable
							key={`iframe-${index}`}
							className="my-8 w-full"
						>
							<div className="relative aspect-video w-full overflow-hidden rounded-lg border">
								<iframe
									src={part.iframeUrl}
									className="h-full w-full"
									title={isYouTube ? "YouTube Video" : "CNN Stories"}
									allowFullScreen
									loading="lazy"
									sandbox={
										isStories
											? "allow-scripts allow-same-origin allow-popups allow-forms"
											: undefined
									}
									allow={
										isYouTube
											? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
											: "fullscreen"
									}
								/>
							</div>
						</div>
					);
				}

				// Render shortcode component
				if (part.type === "shortcode") {
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
				}

				return null;
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
