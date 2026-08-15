# 沃野香田官网

沃野香田漫剧公司的品牌官网源码，包含首页视频轮播、作品海报与点击播放、公司介绍和联系信息。

## 项目内容

- `app/`：网页页面、样式和交互逻辑
- `public/posters/`：作品海报
- `public/videos/`：网站展示用的加水印视频
- `public/hero-wild-field.png`：视频之间展示的品牌主视觉
- `.openai/hosting.json`：当前 Sites 项目配置

## 本地预览

需要 Node.js 22.13 或更高版本。

```bash
npm install
npm run dev
```

浏览器打开终端显示的本地网址即可预览。

## 构建检查

```bash
npm run build
```

## 上传 GitHub

建议新建 **Private（私有）** 仓库，然后上传本文件夹中的全部内容。不要上传 `node_modules`、`.next`、`dist` 等本地生成目录；项目中的 `.gitignore` 已经排除了这些内容。

当前视频单文件均小于 GitHub 的 100 MB 上限，可以直接提交。仓库设为私有只能保护源码和仓库文件；网站正式部署后，浏览器必须能够读取视频，因此无法彻底阻止访问者通过技术手段保存公开视频。网站内使用加水印、压缩版视频是更实际的保护方式。

## 部署建议

本项目采用 vinext，可构建为 Cloudflare Worker 兼容版本。连接 GitHub 后，可在支持该构建方式的平台部署；部署前先运行 `npm run build` 确认无错误。
