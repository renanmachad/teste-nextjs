/**
 * Parse WordPress shortcodes from HTML content
 */

export interface ReadTooShortcode {
	type: "read_too";
	displayImages: boolean;
	images: string[];
	titles: string[];
	ids: string[];
}

export type Shortcode = ReadTooShortcode;

/**
 * Parse [read_too] shortcode attributes
 */
function parseReadTooShortcode(match: string): ReadTooShortcode {
	// Extract attributes using regex
	const displayImages = match.match(/display_images="([^"]+)"/)?.[1] === "true";
	const imagePostsStr = match.match(/image_posts="([^"]+)"/)?.[1] || "";
	const titlePostsStr = match.match(/title_posts="([^"]+)"/)?.[1] || "";
	const idsStr = match.match(/id="([^"]+)"/)?.[1] || "";

	// Split comma-separated values
	const images = imagePostsStr
		.split(",")
		.map((url) => url.trim())
		.filter(Boolean);
	const titles = titlePostsStr
		.split("__")
		.map((title) => title.trim())
		.filter(Boolean);
	const ids = idsStr
		.split(",")
		.map((id) => id.trim())
		.filter(Boolean);

	return {
		type: "read_too",
		displayImages,
		images,
		titles,
		ids,
	};
}

/**
 * Parse all shortcodes from HTML content
 */
export function parseShortcodes(html: string): {
	content: string;
	shortcodes: Map<string, Shortcode>;
} {
	const shortcodes = new Map<string, Shortcode>();
	let processedContent = html;

	// Find and replace [read_too] shortcodes
	const readTooRegex = /\[read_too[^\]]*\]\s*\[\/read_too\]/g;
	let match: RegExpExecArray | null;
	let index = 0;

	// biome-ignore lint/suspicious/noAssignInExpressions: Standard regex exec pattern
	while ((match = readTooRegex.exec(html)) !== null) {
		const shortcodeData = parseReadTooShortcode(match[0]);
		const placeholder = `<!--SHORTCODE_${index}-->`;

		shortcodes.set(placeholder, shortcodeData);
		processedContent = processedContent.replace(match[0], placeholder);

		index++;
	}

	return {
		content: processedContent,
		shortcodes,
	};
}

/**
 * Split HTML content by shortcode placeholders
 */
export function splitContentByShortcodes(html: string): Array<{
	type: "html" | "shortcode";
	content: string;
}> {
	const parts: Array<{ type: "html" | "shortcode"; content: string }> = [];
	const shortcodePlaceholderRegex = /<!--SHORTCODE_(\d+)-->/g;

	let lastIndex = 0;
	let match: RegExpExecArray | null;

	// biome-ignore lint/suspicious/noAssignInExpressions: Standard regex exec pattern
	while ((match = shortcodePlaceholderRegex.exec(html)) !== null) {
		// Add HTML content before shortcode
		if (match.index > lastIndex) {
			const htmlContent = html.slice(lastIndex, match.index);
			if (htmlContent.trim()) {
				parts.push({ type: "html", content: htmlContent });
			}
		}

		// Add shortcode placeholder
		parts.push({ type: "shortcode", content: match[0] });

		lastIndex = match.index + match[0].length;
	}

	// Add remaining HTML content
	if (lastIndex < html.length) {
		const htmlContent = html.slice(lastIndex);
		if (htmlContent.trim()) {
			parts.push({ type: "html", content: htmlContent });
		}
	}

	return parts;
}
