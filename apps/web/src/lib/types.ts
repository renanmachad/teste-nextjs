// CNN Brasil API Types (raw response from API)

export interface CNNTag {
	id: string;
	name: string;
	slug: string;
	hidden: boolean;
	permalink: string;
	description: string;
}

export interface CNNCategory {
	id: string;
	name: string;
	slug: string;
	hidden: boolean;
	permalink: string;
	description: string;
}

export interface CNNImage {
	id: number;
	url: string;
	fallback: string;
	alt: string;
	title: string;
	caption: string;
	credits: string;
	hidden: boolean;
}

export interface CNNAuthor {
	name: string;
	slug: string;
	image?: {
		id: number;
		url: string;
		alt: string;
	};
}

export interface CNNContent {
	type: string;
	raw: string;
}

export interface CNNPost {
	id: string;
	status: string;
	publish_date: string;
	modified_date: string;
	upper_title: string;
	title: string;
	excerpt: string;
	slug: string;
	permalink: string;
	featured_media?: {
		image?: CNNImage;
	};
	category?: CNNCategory; // API returns single category object
	tags?: CNNTag[];
	author?: CNNAuthor;
	content?: CNNContent | string;
}

export interface CNNPostsResponse {
	page: number;
	max_pages: number;
	posts: CNNPost[];
}

// Normalized types for our app
export interface Category {
	id: number;
	name: string;
	slug: string;
	description?: string;
}

export interface Author {
	id: number;
	name: string;
	slug: string;
	avatar_url?: string;
	bio?: string;
}

export interface Image {
	url: string;
	width: number;
	height: number;
	alt?: string;
}

export interface Post {
	id: number;
	slug: string;
	title: string;
	excerpt: string;
	content: string;
	published_at: string;
	updated_at: string;
	featured_image?: Image;
	category: Category;
	categories?: Category[];
	author: Author;
	tags?: string[];
	read_time?: number;
}

export interface PostsResponse {
	data: Post[];
	total: number;
	page: number;
	per_page: number;
	total_pages: number;
}

export type LayoutType = "layout-a" | "layout-b";

export interface LayoutPreference {
	layout: LayoutType;
	updated_at: string;
}
