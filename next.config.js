/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  basePath: process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}` : '',
  trailingSlash: true,
  eslint: { ignoreDuringBuilds: true },
pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js', 'tsx', 'ts', 'jsx', 'js'],
}