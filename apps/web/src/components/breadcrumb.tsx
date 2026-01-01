import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
	label: string;
	href: string;
}

interface BreadcrumbProps {
	items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
	return (
		<nav aria-label="Breadcrumb" className="py-3">
			<ol className="flex items-center gap-2 text-muted-foreground text-sm">
				<li>
					<Link
						href="/"
						className="flex items-center gap-1 transition-colors hover:text-foreground"
						aria-label="Home"
					>
						<Home className="h-4 w-4" />
						<span className="sr-only">Home</span>
					</Link>
				</li>

				{items.map((item, index) => {
					const isLast = index === items.length - 1;

					return (
						<li key={item.href} className="flex items-center gap-2">
							<ChevronRight className="h-4 w-4" aria-hidden="true" />
							{isLast ? (
								<span className="line-clamp-1 font-medium text-foreground">
									{item.label}
								</span>
							) : (
								<Link
									href={item.href as any}
									className="line-clamp-1 transition-colors hover:text-foreground"
								>
									{item.label}
								</Link>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
