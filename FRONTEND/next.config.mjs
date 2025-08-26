/** @type {import('next').NextConfig} */

const API_HOST = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';


const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },

  async rewrites() {
    return [
       {
        source: '/backend/:path*',
        destination: `${API_HOST}/api/:path*`,
      },
      
      { source: "/dashboard/:role/tasks", destination: "/tasks" },
      { source: "/dashboard/:role/tasks/new", destination: "/tasks/new" },
      { source: "/dashboard/:role/tasks/:id", destination: "/tasks/:id" },
      { source: "/dashboard/:role/tasks/:id/edit", destination: "/tasks/:id/edit" },
    ];
  },
};
export default nextConfig;