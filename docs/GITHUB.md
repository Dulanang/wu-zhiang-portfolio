# 上传 GitHub

这个文件夹已经初始化为本地 Git 仓库，主分支为 main；尚未提交、连接远程仓库或上传。

## 推荐：GitHub Desktop

1. 打开 GitHub Desktop，添加现有本地仓库，选择本项目文件夹 `wu-zhiang-portfolio`。
2. 查看 Changes，确认代码、public/assets 和说明文件都已列出，node_modules、dist 不在其中。
3. 填写首次提交说明，例如 `Initial portfolio`，提交到 main。
4. 使用 Publish repository，名称可填 `wu-zhiang-portfolio`。建议暂时保持私有。
5. 后续换图或改文字后，先本地预览，再提交修改并推送。

如果使用 ZIP，请先解压。ZIP 不包含隐藏的 .git 历史，需要在解压后的文件夹初始化仓库。

## 命令行方式

在本项目文件夹打开终端：

```sh
git add .
git commit -m "Initial portfolio"
```

若提示缺少姓名和邮箱，使用自己的 Git 提交身份配置。之后在 GitHub 建立空仓库，不自动添加 README 或许可证，复制该仓库地址：

```sh
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

把 YOUR_REPOSITORY_URL 替换为自己的仓库地址；不要原样输入。

## 上传和上线的区别

推送 GitHub 保存的是源代码，不会自动让网站上线。本项目暂未配置自动部署。

当前资源路径使用 `/assets/...`，适合部署到域名根目录。若以后使用 `用户名.github.io/仓库名/` 这样的 GitHub Pages 子路径，需要同时适配资源路径和 Vite base，不能只上传 dist 后就假设可以正常运行。

公开仓库会公开当前配置中的微信、手机号、邮箱及所有提交的作品素材。它们目前是你指定的展示信息；请在发布前确认内容和素材公开范围。
