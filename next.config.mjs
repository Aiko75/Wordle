/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true }, // tránh lỗi ảnh
  basePath: "/Wordle", // trùng tên repo
  assetPrefix: "/Wordle/",
};
export default nextConfig;
