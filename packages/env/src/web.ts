import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		ADMIN_USERNAME: z.string().default("admin"),
		ADMIN_PASSWORD: z.string().default("admin123"),
		API_BASE_URL: z
			.url()
			.default("https://admin.cnnbrasil.com.br/wp-json/content/v1/posts"),
	},
	client: {},
	experimental__runtimeEnv: {},
	emptyStringAsUndefined: true,
});
