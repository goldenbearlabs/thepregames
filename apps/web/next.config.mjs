/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: [
      "@thepregames/shared",
      "@thepregames/ui",
      "@thepregames/game-engines",
      "@thepregames/api-clients"
    ]
  };
  export default nextConfig;
  