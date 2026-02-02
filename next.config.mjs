/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXTAUTH_URL: 'https://maikeldrukuje.pl',
        NEXTAUTH_SECRET: 'secret-random-string-123-hardcoded-fallback',
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '20mb',
        },
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

export default nextConfig;
