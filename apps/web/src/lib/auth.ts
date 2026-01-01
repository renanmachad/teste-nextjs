"use client";

const AUTH_TOKEN_KEY = "cnn-admin-token";

/**
 * Stores authentication token in localStorage
 */
export function setAuthToken(token: string): void {
	if (typeof window !== "undefined") {
		localStorage.setItem(AUTH_TOKEN_KEY, token);
	}
}

/**
 * Retrieves authentication token from localStorage
 */
export function getAuthToken(): string | null {
	if (typeof window !== "undefined") {
		return localStorage.getItem(AUTH_TOKEN_KEY);
	}
	return null;
}

/**
 * Checks if user is authenticated
 */
export function isAuthenticated(): boolean {
	return getAuthToken() !== null;
}

/**
 * Removes authentication token from localStorage
 */
export function logout(): void {
	if (typeof window !== "undefined") {
		localStorage.removeItem(AUTH_TOKEN_KEY);
	}
}

/**
 * Performs login by calling the API endpoint
 */
export async function login(
	username: string,
	password: string,
): Promise<{ success: boolean; error?: string }> {
	try {
		const response = await fetch("/api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, password }),
		});

		const data = await response.json();

		if (!response.ok) {
			return { success: false, error: data.error || "Login failed" };
		}

		if (data.token) {
			setAuthToken(data.token);
			return { success: true };
		}

		return { success: false, error: "No token received" };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Network error",
		};
	}
}
