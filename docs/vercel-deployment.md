# Jimmy Blog - Vercel 部署文档

本文档说明如何将 Jimmy Blog 部署到 Vercel，并正确配置管理后台的 GitHub 登录功能。

---

## 一、前置要求

- **GitHub 账号**：代码托管与 OAuth 登录
- **Vercel 账号**：可 [vercel.com](https://vercel.com) 使用 GitHub 登录
- **Node.js**：本地如需调试，建议 18+（Vercel 会自动使用项目兼容的 Node 版本）

---

## 二、部署到 Vercel

### 2.1 从 GitHub 导入项目

1. 登录 [Vercel](https://vercel.com)，进入 **Dashboard**
2. 点击 **Add New…** → **Project**
3. 选择 **Import Git Repository**，找到你的博客仓库并 **Import**
4. 在 **Configure Project** 页面确认：
   - **Framework Preset**：Next.js（通常自动识别）
   - **Build Command**：`pnpm build`（项目已通过 `vercel.json` 配置，一般无需改）
   - **Output Directory**：留空（Next.js 默认）
   - **Install Command**：`pnpm install`

### 2.2 首次部署前先配置环境变量（重要）

**在点击 Deploy 之前**，建议先在项目设置里把环境变量配好，否则首次部署后访问 `/admin` 登录会报错。

1. 在 **Configure Project** 页面找到 **Environment Variables**
2. 按下面「环境变量配置」一节添加所有必需变量
3. 再点击 **Deploy** 开始构建

若已部署过，可到 **Project → Settings → Environment Variables** 中补全或修改。

### 2.3 部署与自动更新

- 首次 **Deploy** 完成后，会得到 `xxx.vercel.app` 的预览地址
- 之后每次向该仓库 **main** 分支 push，Vercel 会自动重新构建并发布
- 若使用自定义域名，在 **Settings → Domains** 中绑定即可

---

## 三、环境变量配置

以下变量在 Vercel 的 **Settings → Environment Variables** 中配置。  
请为 **Production**、**Preview**（可选）、**Development**（本地用，可选）分别设置合适值。

### 3.1 必需变量（登录与管理后台）

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `GITHUB_CLIENT_ID` | GitHub OAuth App 的 Client ID | 从 GitHub OAuth App 创建后获得 |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App 的 Client Secret | 同上，需保密 |
| `NEXT_PUBLIC_BASE_URL` | 博客对外访问的完整根 URL（**必须与最终访问域名一致**） | `https://www.jimmy-blog.top` 或 `https://xxx.vercel.app` |

**说明：**

- `NEXT_PUBLIC_BASE_URL` 用于 OAuth 回调地址、sitemap、robots 等，**生产环境务必设为实际访问的域名（含 `https://`）**，否则登录回调会失败。
- 若使用 Vercel 默认域名，格式为：`https://你的项目名.vercel.app`（不要带尾部斜杠）。

### 3.2 可选变量（有默认值）

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `GITHUB_OWNER` | GitHub 用户名（仓库所有者，用于校验登录者是否为仓库成员） | `Lily-404` |
| `GITHUB_REPO` | 仓库名 | `blog` |
| `GITHUB_REDIRECT_URI` | OAuth 回调完整 URL | 不设时使用 `{NEXT_PUBLIC_BASE_URL}/api/auth/github/callback` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 测量 ID | 不设则不加载统计 |

生产环境一般只需设置 **GITHUB_CLIENT_ID**、**GITHUB_CLIENT_SECRET**、**NEXT_PUBLIC_BASE_URL**，以及按需设置 **GITHUB_OWNER** / **GITHUB_REPO**。

---

## 四、登录功能：GitHub OAuth 配置

管理后台（`/admin`）使用 **GitHub OAuth** 登录，只有仓库所有者或协作者能访问。  
OAuth 回调地址必须与 Vercel 上实际访问的域名一致，否则登录会失败。

### 4.1 创建 GitHub OAuth App

1. 打开 [GitHub → Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. 点击 **New OAuth App**
3. 填写：
   - **Application name**：随意，如 `Jimmy Blog Admin`
   - **Homepage URL**：与 `NEXT_PUBLIC_BASE_URL` 一致  
     例如：`https://www.jimmy-blog.top` 或 `https://xxx.vercel.app`
   - **Authorization callback URL**（重要）：  
     `{NEXT_PUBLIC_BASE_URL}/api/auth/github/callback`  
     例如：`https://www.jimmy-blog.top/api/auth/github/callback`
4. 保存后，在应用页面复制 **Client ID**，并 **Generate a new client secret**，得到 **Client secret**
5. 将 **Client ID** 填入 Vercel 的 `GITHUB_CLIENT_ID`，**Client secret** 填入 `GITHUB_CLIENT_SECRET`

### 4.2 生产 / 预览 / 本地 多环境

- **生产域名**（如 `https://www.jimmy-blog.top`）：  
  在 GitHub 里可以只填一个 OAuth App，Homepage URL 和 Authorization callback URL 都填生产域名；Vercel 生产环境变量里 `NEXT_PUBLIC_BASE_URL` 设为同一域名即可。
- **Vercel 预览域名**（如 `https://xxx-git-xxx.vercel.app`）：  
  若希望预览环境也能登录，有两种方式：
  1. 再建一个 GitHub OAuth App，专门用于预览，回调 URL 填预览域名，并在 Vercel 的 **Preview** 环境变量里使用该 App 的 Client ID/Secret 和对应的 `NEXT_PUBLIC_BASE_URL`；
  2. 或者同一 OAuth App 在 GitHub 的 **Authorization callback URL** 中增加一条预览域名的回调（如 `https://*.vercel.app/api/auth/github/callback`，若 GitHub 支持通配符）——注意 GitHub 当前对回调 URL 是否支持通配符可能有限制，以 GitHub 文档为准。
- **本地开发**：  
  本地 `NEXT_PUBLIC_BASE_URL=http://localhost:3000`，在 GitHub 同一 OAuth App 或另建一个 App，回调 URL 填 `http://localhost:3000/api/auth/github/callback`。

### 4.3 登录流程简述

1. 用户访问 `/admin`，未登录则显示「用 GitHub 登录」
2. 点击后跳转到 GitHub 授权页（`/api/auth/github` 会重定向到 GitHub）
3. 用户授权后，GitHub 重定向到 `{NEXT_PUBLIC_BASE_URL}/api/auth/github/callback?code=...`
4. 服务端用 `code` 换 token，并校验用户是否为 `GITHUB_OWNER/GITHUB_REPO` 的协作者/所有者
5. 通过后写入 Cookie（`github_access_token`、`github_username` 等），再重定向回 `/admin`，即登录成功

因此 **回调 URL 必须与 Vercel 上设置的 `NEXT_PUBLIC_BASE_URL` 完全一致**（协议 + 域名 + 无尾部斜杠）。

---

## 五、登录相关注意事项（Cookie / 安全）

- **Secure Cookie**：生产环境（`NODE_ENV=production`）下，OAuth 相关 Cookie 会带 `secure`，仅 HTTPS 生效，这是预期行为。
- **SameSite**：使用 `lax`，在从 GitHub 跳回本站时能正常带 Cookie。
- **域名**：Cookie 作用域为当前站点域名，与 `NEXT_PUBLIC_BASE_URL` 一致即可；若你配置了自定义域名，确保 Vercel 和 OAuth 回调都使用该域名。
- **修改域名或环境变量后**：需重新部署（或等下一次自动部署），并确认 GitHub OAuth App 的回调 URL 已更新，否则登录会失败或出现「状态验证失败」等错误。

---

## 六、自定义域名（可选）

1. 在 Vercel 项目 **Settings → Domains** 中添加你的域名（如 `www.jimmy-blog.top`）
2. 按 Vercel 提示在 DNS 中添加 CNAME 或 A 记录
3. 将 **环境变量** 中的 `NEXT_PUBLIC_BASE_URL` 改为 `https://www.jimmy-blog.top`（与你在 Domains 里填的一致）
4. 在 **GitHub OAuth App** 中把 Homepage URL 和 Authorization callback URL 改为 `https://www.jimmy-blog.top` 和 `https://www.jimmy-blog.top/api/auth/github/callback`
5. 重新部署一次，使新环境变量生效

---

## 七、项目在 Vercel 上的构建配置

项目根目录的 `vercel.json` 已指定：

- `installCommand`: `pnpm install`
- `buildCommand`: `pnpm build`

构建会执行 `next build` 以及 RSS 生成（`tsx scripts/generate-rss.ts`）。  
若你使用 npm，可在 Vercel 项目 **Settings → General** 里覆盖 Install/Build 命令；否则保持默认即可。

---

## 八、常见问题

**Q: 部署成功，但点「用 GitHub 登录」报错「OAuth 配置不完整」**  
A: 检查 Vercel 环境变量是否已添加 `GITHUB_CLIENT_ID`、`GITHUB_CLIENT_SECRET`，且对 **Production** 生效。添加或修改后需重新部署。

**Q: 登录后跳回 /admin 显示「状态验证失败」**  
A: 多为回调 URL 与当前访问域名不一致，或 Cookie 未正确写回。请确认：  
1）GitHub OAuth App 的 Authorization callback URL 与 `NEXT_PUBLIC_BASE_URL` 完全一致（如 `https://你的域名/api/auth/github/callback`）；  
2）Vercel 中 `NEXT_PUBLIC_BASE_URL` 为当前访问的根 URL（如 `https://www.jimmy-blog.top` 或 `https://xxx.vercel.app`）；  
3）修改环境变量或 OAuth 配置后已重新部署。

**Q: 本地能登录，Vercel 上不能**  
A: 本地用的是 `http://localhost:3000`，生产必须用 HTTPS 且域名一致。检查生产环境的 `NEXT_PUBLIC_BASE_URL` 和 GitHub 回调 URL 是否都指向 Vercel 上的访问地址。

**Q: 只有仓库所有者/协作者能登录吗？**  
A: 是的。后端会用 GitHub API 校验当前用户是否为 `GITHUB_OWNER/GITHUB_REPO` 的协作者或所有者，否则不会写入登录态。

**Q: 想用 Vercel 默认域名（xxx.vercel.app）**  
A: 把 `NEXT_PUBLIC_BASE_URL` 设为 `https://你的项目名.vercel.app`（以实际分配为准），并在 GitHub OAuth App 的回调 URL 中填写 `https://你的项目名.vercel.app/api/auth/github/callback` 即可。

---

## 九、检查清单

部署完成后可用下面清单自检：

- [ ] Vercel 项目已从 GitHub 导入并成功构建
- [ ] 已配置 `GITHUB_CLIENT_ID`、`GITHUB_CLIENT_SECRET`、`NEXT_PUBLIC_BASE_URL`（生产）
- [ ] GitHub OAuth App 的 Homepage URL、Authorization callback URL 与 `NEXT_PUBLIC_BASE_URL` 一致
- [ ] 访问 `https://你的域名/admin` 能打开页面，点击 GitHub 登录能完成授权并回到 /admin
- [ ] 若使用自定义域名，已在 Vercel Domains 中绑定并在 OAuth 与 `NEXT_PUBLIC_BASE_URL` 中使用该域名

按本文配置后，博客可稳定部署在 Vercel，管理后台登录功能可正常使用。
