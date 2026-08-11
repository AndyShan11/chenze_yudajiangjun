# 陈泽 × 宇大将军三轴人像校准器

一个完全静态、开源、无需登录的三轴人像滑动变阻器。

- 横轴：陈泽 → 宇大将军（31 张 RIFE 4.6 独立插帧）
- 纵轴：男性 → 中性 → 女性（9 级独立插帧）
- 年龄轴：婴儿 → 成人 → 老人（9 级独立插帧）
- 任一时刻只显示一张完整人像，不使用透明度叠图
- 支持鼠标、触摸和键盘操作
- 无账号、无后端、无追踪，纯静态运行

## 在线使用

<https://andyshan11.github.io/chenze_yudajiangjun/>

创作者主页：<https://andyshan11.github.io/>

## 实现说明

人物、性别与年龄锚点经过 [RIFE ncnn Vulkan](https://github.com/nihui/rife-ncnn-vulkan) 扩展为 9 × 9 × 31 的独立帧网格。网页根据三个滑杆的位置直接切换单张 WebP 文件，不进行多图透明混合。

页面交互参考了 [liang-intensity-calibrator](https://github.com/Lichtspektrum/liang-intensity-calibrator) 的预插帧思路。

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

产物位于 `dist/`，可部署到任意静态托管服务。

## 部署

仓库内置 GitHub Pages 工作流。向 `main` 分支推送提交后会自动构建并发布。

## 许可

代码采用 [MIT License](./LICENSE)。人物图像是基于用户提供参考生成的演示素材；转载或用于其他项目时，请自行确认相关肖像与内容使用权。
