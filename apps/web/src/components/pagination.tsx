"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "./ui/button";

interface PaginationProps {
	currentPage: number;
	totalResults: number;
	resultsPerPage: number;
}

export function Pagination({
	currentPage,
	totalResults,
	resultsPerPage,
}: PaginationProps) {
	const [, setPage] = useQueryState("page", {
		defaultValue: "1",
		shallow: false,
	});

	const totalPages = Math.ceil(totalResults / resultsPerPage);

	// Don't show pagination if there's only one page
	if (totalPages <= 1) {
		return null;
	}

	const handlePageChange = (page: number) => {
		setPage(page.toString());
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// Generate page numbers to display
	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const showEllipsis = totalPages > 7;

		if (!showEllipsis) {
			// Show all pages if 7 or fewer
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			if (currentPage <= 3) {
				// Near start: 1 2 3 4 ... N
				pages.push(2, 3, 4, "...", totalPages);
			} else if (currentPage >= totalPages - 2) {
				// Near end: 1 ... N-3 N-2 N-1 N
				pages.push(
					"...",
					totalPages - 3,
					totalPages - 2,
					totalPages - 1,
					totalPages,
				);
			} else {
				// Middle: 1 ... current-1 current current+1 ... N
				pages.push(
					"...",
					currentPage - 1,
					currentPage,
					currentPage + 1,
					"...",
					totalPages,
				);
			}
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<nav
			className="flex items-center justify-center gap-1"
			aria-label="Pagination"
		>
			{/* Previous Button */}
			<Button
				variant="outline"
				size="sm"
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="gap-1"
			>
				<ChevronLeft className="h-4 w-4" />
				<span className="sr-only sm:not-sr-only">Anterior</span>
			</Button>

			{/* Page Numbers */}
			<div className="flex items-center gap-1">
				{pageNumbers.map((page, index) => {
					if (page === "...") {
						return (
							<span
								key={`ellipsis-${
									// biome-ignore lint/suspicious/noArrayIndexKey: ellipsis doesn't have unique identifier
									index
								}`}
								className="px-2 text-muted-foreground"
							>
								...
							</span>
						);
					}

					const pageNum = page as number;
					const isActive = pageNum === currentPage;

					return (
						<Button
							key={pageNum}
							variant={isActive ? "default" : "outline"}
							size="sm"
							onClick={() => handlePageChange(pageNum)}
							disabled={isActive}
							className="min-w-[2.5rem]"
						>
							{pageNum}
						</Button>
					);
				})}
			</div>

			{/* Next Button */}
			<Button
				variant="outline"
				size="sm"
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="gap-1"
			>
				<span className="sr-only sm:not-sr-only">Próxima</span>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</nav>
	);
}
