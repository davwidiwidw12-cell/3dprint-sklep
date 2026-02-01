import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: true, // process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXTAUTH_URL: 'https://maikeldrukuje.pl',
        NEXTAUTH_SECRET: 'secret-random-string-123-hardcoded-fallback',
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // output: 'standalone', // Uncomment for Docker optimization if needed
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            }
        ]
    }
};

export default withSerwist(nextConfig);
