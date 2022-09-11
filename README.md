# Icalingua 3

新版 Icalingua。将抛弃 Electron，转向网页前端 + Node 后端（类似于原来 icalingua-bridge-oicq）的模式。

正在开发中。当前技术栈选型：

- oicq2
- socket.io
- Vue3
- Fastify
- WindiCSS
- rxjs
- MikroORM
- 后端也采用 Native ESM 而非 CommonJS（要求 Nodejs >= 16）

## 如何开发

```bash
git clone https://github.com/Icalingua-plus-plus/Icalingua3
pnpm i # 需要 Node.js 16 或以上，并且启用 corepack
pnpm dev # 这条命令会同时启动前后端
```

在开发后端（而不需要 oicq）时，频繁启动服务器可能让 oicq 频繁登录而风控，这时用 `pnpm dev:backend -- --n` 可以不启动 oicq 而启动后端。

## 关于官方可能的 Electron 版本

在官方可能的 Electron 版本功能和支持的平台种类超过 Icalingua 之前，本 repo 会保持更新。
