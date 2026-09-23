# 替换图片与扩充项目

所有图片放在项目根目录下的 `public/assets/`。

- 首页封面建议 1920×1080；螺旋及列表会居中裁切，主体放在中间。
- 详情横图建议 1920×1080；详情页按原比例显示，允许方图、竖图和长图。
- 详情图建议宽度 1600～1920，过长的图可拆成多张。
- 建议压缩图片，通常单张控制在 1 MB 左右；格式可用 JPG、PNG 或 WebP。

## 同名覆盖

以第一个项目为例：

- `paths-of-life.png`：首页封面、列表预览及详情首图。
- `paths-of-life-detail-1.webp`：第一张详情图。
- `paths-of-life-detail-2.webp`：第二张详情图。
- `paths-of-life-detail-3.webp`：第三张详情图。

导出为相同格式和文件名后覆盖原文件。不能只更改扩展名来转换格式。刷新本地页面即可查看；已经构建或部署的版本需要重新构建。

## 修改名称、简介或增加图片

打开 `src/components/sections/section_1/projects.json`：

- `title`：项目名称。
- `description`：项目简介。
- `year`：年份。
- `image`：封面路径，例如 `/assets/my-cover.jpg`。
- `blocks`：详情内容，按数组顺序显示。

可在 blocks 中追加以下内容（注意 JSON 逗号）：

```json
[
  {"type":"text","heading":"设计思路","body":"这里填写说明。"},
  {"type":"image","src":"/assets/detail-01.jpg","alt":"作品细节","caption":"图片说明"},
  {"type":"gallery","images":[{"src":"/assets/detail-02.jpg","alt":"细节二"},{"src":"/assets/detail-03.jpg","alt":"细节三"}]}
]
```

建议图片名称使用英文字母、数字和短横线，注意大小写。不要在配置中写电脑上的绝对路径。

联系方式目前由 `Section1.jsx` 中的菜单内容控制；`projects.json` 的 email 控制邮箱。更新微信或手机时，请同步更改显示文本、复制内容及电话链接。

## 自动按编号添加详情图片（无固定张数上限）

在 `public/assets/` 中使用 `项目slug-1.png`、`项目slug-2.png`、`项目slug-3.png` 等名称，编号可以一直增加。支持 PNG、JPG、JPEG、WebP、AVIF、GIF；同一个编号只保留一种格式。

例如 IP-Design-Mokin 继续沿用原文件名前缀：

```text
the-disease-spread-on-tiktok-1.png
the-disease-spread-on-tiktok-2.png
...
the-disease-spread-on-tiktok-6.png
```

未带数字的 `the-disease-spread-on-tiktok.png` 是独立封面，不计入 6 张详情图。自动排序采用数字顺序（2 排在 10 前面）。不要求连续编号。

启动 `pnpm dev` 或运行 `pnpm build` 时会自动扫描并更新项目配置。已运行的开发预览中新增图片后，执行 `pnpm sync:images`；4173 构建预览需要重新执行 `pnpm build` 后刷新。

同项目若有 `slug-编号` 图片，会优先使用这一组，替换旧的 `slug-detail-编号` 图片引用；没有新命名时继续识别 `slug-detail-编号`。旧图片文件不会被删除。已有文字、图组保留。

需要完全手动安排图片和文字时，在该项目配置中添加 `"autoImages": false`，再自由编辑 blocks；手动模式同样不限制张数。
