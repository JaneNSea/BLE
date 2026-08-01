# Personal Technology Portfolio

一个面向面试官、投资人和比赛评委的个人技术品牌站骨架。首页负责策展，文章和项目由内容集合驱动；新增内容不需要修改页面代码。

## 开始使用

```bash
npm install
npm run dev
```

Windows PowerShell 如果阻止 `npm.ps1`，使用：

```powershell
npm.cmd install
npm.cmd run dev
```

提交前执行：

```bash
npm run check
npm run build
```

## 第一次替换

1. 修改 `src/data/site.ts` 中的简介、角色和其他个人资料。
2. 将头像文件命名为 `avatar.jpg`，放到 `public/avatar.jpg`。
3. 删除或改写带有“示例/待替换”标记的内容文件。
4. 在 `astro.config.mjs` 设置 GitHub Pages 的 `site`；项目型 Pages 还需设置 `base`。
5. 在 GitHub 仓库的 Settings → Pages 中选择 GitHub Actions 作为发布源。

## 内容目录

- `src/content/products/`：闭源、商业化产品案例，首页优先级最高。
- `src/content/projects/`：课程设计、Demo、开源学习项目。
- `src/content/notes/`：针对单个技术问题的短文章。
- `src/content/principles/`：个人设计和工程原则。

内容中的 `cover` 使用 `public/` 下的站点相对路径，例如
`cover: "/media/projects/sensor-dashboard.webp"`；组件会自动兼容 GitHub Pages 的 `base`。

推荐通过脚本创建内容：

```bash
npm run new:note -- ble-connection-timeout
npm run new:project -- sensor-dashboard
npm run new:product -- product-codename
```

脚本只生成内容文件。路由、列表、首页精选和类型校验由 Astro Content Collections 自动处理。

## GitHub Pages

工作流位于 `.github/workflows/deploy-pages.yml`。如果仓库名是
`<username>.github.io`，一般不需要 `base`；如果发布地址包含仓库名，则将
`base` 设置为 `/<repository-name>`。所有站内链接通过 `withBase()` 生成，以兼容两种形式。
