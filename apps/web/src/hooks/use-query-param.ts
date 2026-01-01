"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, Suspense } from "react";

function useQueryParamInner(key: string): [string | null, (value: string | null) => void] {
	const router = useRouter();
	const searchParams = useSearchParams();

	const value = searchParams?.get(key) ?? null;

	const setValue = useCallback(
		(newValue: string | null) => {
			if (typeof window === "undefined") return;

			const params = new URLSearchParams(searchParams?.toString() || "");

			if (newValue === null || newValue === "") {
				params.delete(key);
			} else {
				params.set(key, newValue);
			}

			const queryString = params.toString();
			const newUrl = queryString ? `?${queryString}` : window.location.pathname;

			router.push(newUrl as any);
		},
		[key, router, searchParams],
	);

	return [value, setValue];
}

export function useQueryParam(key: string): [string | null, (value: string | null) => void] {
	// Return fallback during SSR or before Suspense resolves
	try {
		return useQueryParamInner(key);
	} catch {
		return [null, () => {}];
	}
}
