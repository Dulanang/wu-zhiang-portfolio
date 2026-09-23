# Wu Zhiang — Brand & 3D Designer

个人作品集前端：3D 螺旋作品墙、鼠标跟随列表、图文项目详情、开场动画和声音开关。基于 React、Vite、Three.js 与 Lottie。

在线网站：https://dulanang.github.io/wu-zhiang-portfolio/

GitHub 仓库：https://github.com/Dulanang/wu-zhiang-portfolio

## 本地运行

安装 Node.js 24 LTS，然后在本项目文件夹打开终端：

```sh
npm install -g pnpm@11.19.0
pnpm install --frozen-lockfile
pnpm dev --host 127.0.0.1 --port 3230
```

浏览器访问 http://127.0.0.1:3230/ 。如果旧预览仍在使用 3230 端口，可改为 3231，并访问终端显示的地址。

```sh
pnpm build
pnpm preview --host 127.0.0.1 --port 4173
```

构建产物位于 `dist/`，需通过 HTTP 服务打开。

推送到 `main` 分支后，GitHub Actions 会自动构建并更新线上网站。

## 常用文件

| 位置 | 用途 |
| --- | --- |
| `public/assets/` | 图片、音效、字体与动画 |
| `src/components/sections/section_1/projects.json` | 九个项目的标题、简介、封面和图文内容 |
| `src/components/sections/section_1/Section1.jsx` | 主页面、菜单与联系方式 |
| `src/components/sections/section_1/section_1.css` | 页面样式 |
| `src/components/sections/section_1/audio.json` | 声音素材及音量 |
| `docs/EDITING.md` | 图片替换与项目扩充指南 |
| `docs/GITHUB.md` | 上传 GitHub 的步骤 |

请统一使用 pnpm，并提交 `pnpm-lock.yaml`，让不同电脑安装同一组依赖。`node_modules/`、`dist/`、本地环境文件与日志已被 Git 忽略。

## 当前内容

姓名 Wu Zhiang；介绍 Brand & 3D Designer / Based in Hefei。微信 Dulanang，手机 17756971591，邮箱 1091447325@qq.com。小红书和抖音暂不配置链接。

九个项目是图文详情。左下角 Showreel 仍使用原站 Mux 视频流，依赖外部服务；此前首帧加载超时，保留失败提示。开场姓名在动画中段出现，随后切换为图形。新标签页可重新观看开场。

## 素材来源

页面参考 https://pacomepertant.com/ 。目前项目图片、部分文案、图形、字体、音效和动画仍来自参考站，供本地复刻和替换。它们不因本仓库而获得新的授权；未附加涵盖这些素材的开源许可。

本项目尚未上传 GitHub，也未部署。上传前建议先使用私有仓库，换入自己的作品及有权公开的素材后再决定是否公开。
