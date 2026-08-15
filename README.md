# 沃野香田官网（Cloudflare Pages 静态版）

沃野香田漫剧公司的品牌官网源码，包含首页视频轮播、作品海报与点击播放、公司介绍和联系信息。

## 本地预览

需要 Node.js 22.13 或更高版本。

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

构建完成后，静态网站位于 `dist/`，并包含 Cloudflare Pages 需要的 `dist/index.html`。

## Cloudflare Pages 设置

- 框架预设：`Vite`
- 构建命令：`npm run build`
- 构建输出目录：`dist`
- 根目录：保持空白（仓库根目录）
- 生产分支：`main`

## GitHub

建议使用 Private（私有）仓库。项目中的视频单文件均低于 GitHub 的 100 MB 上限，可以直接提交。

仓库私有只能保护源码；网站正式部署后，浏览器必须读取公开视频，因此无法彻底阻止访问者通过技术手段保存。网站使用加水印、压缩版视频是更实际的保护方式。
