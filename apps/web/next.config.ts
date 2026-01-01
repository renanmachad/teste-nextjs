import "@,/env/web";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "admin.cnnbrasil.com.br",
				port: "",
				pathname: "/wp-content/uploads/**",
			}
		]
	}
};

export default nextConfig;
