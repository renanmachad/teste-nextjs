import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		ADMIN_USERNAME: z.string().default("admin"),
		ADMIN_PASSWORD: z.string().default("admin123"),
	},
	client: {},
	experimental__runtimeEnv: {},
	emptyStringAsUndefined: true,
});