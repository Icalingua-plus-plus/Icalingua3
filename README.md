# Icalingua 3

新版 Icalingua。将抛弃 Electron，转向网页前端 + Node 后端（类似于原来 icalingua-bridge-oicq）的模式。后端会提供开放的 REST API 和 WebSocket API，方便其他客户端 / 机器人调用。

正在开发中。当前技术栈选型：

- oicq2
- socket.io
- Vue3
- Fastify
- WindiCSS
- rxjs
- MikroORM
- 后端也采用 Native ESM 而非 CommonJS（要求 Nodejs >= 16）

## 🖊 如何开发

```bash
git clone https://github.com/Icalingua-plus-plus/Icalingua3
pnpm i # 需要 Node.js 16 或以上，并且启用 corepack
pnpm dev # 这条命令会同时启动前后端
```

在开发后端（而不需要 oicq）时，频繁启动服务器可能让 oicq 频繁登录而风控，这时用 `pnpm dev:backend -- --n` 可以不启动 oicq 而启动后端。

## 🐋 Docker 部署流程

Icalingua3 现已支持使用 docker 部署。

```bash
mkdir /usr/share/Icalingua
cd /usr/share/Icalingua
wget https://github.com/Icalingua-plus-plus/Icalingua3/raw/main/docker-compose.yml
docker compose up -d
```

## 🔒 Icalingua3 身份验证

> **Note**  
> 这是 Icalingua3 的身份验证，不是 oicq 的身份验证，请勿混淆。

第一次登录相当于注册，后面需要输入相同的密码。如果忘记密码，可以通过删除 `./data/passwordSecret.json` 来恢复。使用密码登录时，浏览器端会保存一个 token，下次登录可以直接点登录键，不需要重复输入密码。

### WebAuthn

WebAuthn 是一种新的身份验证方式，可以用于替代密码。要使用 WebAuthn，你需要先登录进 Icalingua，在顶栏进入 WebAuthn 页面，点击 + 号添加一个新的 WebAuthn 密钥。这以后，在登录界面点击 `WebAuthn` 登录。

使用 WebAuthn 登录时，token 不会被存储，这意味着你每次登录都需要进行验证。

> **Warning**  
> 在设置页勾选 `onlyWebAuthn` 之后保存，可以禁用密码登录。在禁用以前，请确保你已经添加了至少一个 WebAuthn 密钥，否则你将无法登录。如果你这么做了，请编辑 `./data/config.json`，将 `onlyWebAuthn` 设置为 `false`。

## ⚛ 关于官方可能的 Electron 版本

在官方可能的 Electron 版本功能和支持的平台种类超过 Icalingua 之前，本 repo 会保持更新。

## 🐧 Linux 系统需要安装的依赖项

- `libfido2`：用于 [WebAuthn](https://wiki.archlinux.org/title/WebAuthn)，如果不需要 WebAuthn 可以不安装。注意这是在客户机（用来打开网页的系统里）装的，不是在服务端（如 docker 容器内）装的。
