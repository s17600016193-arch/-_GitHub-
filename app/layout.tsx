import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "沃野香田｜让故事在旷野生长",
  description: "沃野香田是一家专注原创漫剧与IP内容的叙事创作公司。",
  openGraph: {
    title: "沃野香田｜让故事在旷野生长",
    description: "原创漫剧与IP内容叙事创作公司",
    type: "website",
    images: [{ url: "/og.png", width: 1672, height: 941, alt: "沃野香田——让故事在旷野生长" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "沃野香田｜让故事在旷野生长",
    description: "原创漫剧与IP内容叙事创作公司",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
