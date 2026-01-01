"use client";

import { Search, X } from "lucide-react";
import { useQueryParam } from "@/hooks/use-query-param";
import { useState } from "react";
import { Button } from "./ui-native/button";
import { Input } from "./ui-native/input";

export function SearchBar() {
	const [searchQuery, setSearchQuery] = useQueryParam("search");
	const [inputValue, setInputValue] = useState(searchQuery || "");
	const [isExpanded, setIsExpanded] = useState(!!searchQuery);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputValue.trim()) {
			setSearchQuery(inputValue.trim());
		}
	};

	const handleClear = () => {
		setInputValue("");
		setSearchQuery(null);
		setIsExpanded(false);
	};

	const handleExpand = () => {
		setIsExpanded(true);
		setInputValue(searchQuery || "");
	};

	return (
		<form onSubmit={handleSearch} className="flex items-center gap-2">
			{isExpanded ? (
				<div className="flex items-center gap-2">
					<Input
						type="text"
						placeholder="Buscar matérias..."
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						className="w-64 transition-all"
						autoFocus
					/>
					<Button
						type="submit"
						size="sm"
						variant="ghost"
						disabled={!inputValue.trim()}
					>
						<Search className="h-4 w-4" />
					</Button>
					<Button
						type="button"
						size="sm"
						variant="ghost"
						onClick={handleClear}
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			) : (
				<Button
					type="button"
					size="sm"
					variant="ghost"
					onClick={handleExpand}
				>
					<Search className="h-4 w-4" />
				</Button>
			)}
		</form>
	);
}
