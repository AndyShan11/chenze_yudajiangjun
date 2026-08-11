# 陈宇滑动变阻器

一个完全静态、开源、无需登录的三轴人像滑动校准器。

- 横轴：陈泽 ↔ 宇大将军
- 纵轴：男 ↔ 女
- 年龄轴：婴儿 ↔ 老人
- 支持鼠标、触摸和键盘操作
- 无账号、无后端、无追踪，纯静态运行

## 在线使用

GitHub Pages 部署完成后，可通过以下地址访问：

<https://andyshan11.github.io/chenze_yudajiangjun/>

作者主页：<https://andyshan11.github.io/>

## 本地运行

需要 Node.js 22+ 与 pnpm：

```bash
pnpm install
pnpm dev
```

构建静态文件：

```bash
pnpm build
```

产物位于 `dist/`，可以部署到任意静态托管服务。

## 部署

仓库内置 GitHub Pages 工作流。向 `main` 分支推送后会自动构建并发布。
若首次使用，请在仓库的 **Settings → Pages** 中将 Source 设为 **GitHub Actions**。

## 许可

代码采用 [MIT License](./LICENSE)。人物图像是基于用户提供参考生成的演示素材；转载或用于其他项目时，请自行确认相关肖像与内容使用权。
