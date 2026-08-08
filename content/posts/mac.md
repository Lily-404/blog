---
title: "在新 Mac 上复刻我的终端环境"
date: "2026-08-08"
tags: ["prompt","开发"]
---

这是一份**可复现的终端配置清单**：Shell、终端应用、提示符主题、Zsh 插件与字体。方便换机或重装时恢复同样的终端体验。

**本文不包含：** Node / Python / Go 等语言运行时、数据库、容器、GitHub CLI 等开发工具链 — 那些应单独写一份「开发环境」文档。

**你可以这样用本文：**

1. **先读正文** — 了解会装什么、不会迁移什么，以及和「直接拷贝旧机 dotfiles」的差别。
2. **再复制给 Agent** — 文末按步骤提供了独立代码块；把对应块（或整段「Agent 总指令」）贴给 Cursor / Claude Code 等，让它在新机上按顺序执行。
3. **手动迁移外观** — Powerlevel10k 的详细样式在 `~/.p10k.zsh` 里，需从旧机备份后单独复制（下文有说明，**不要**把该文件提交到公开仓库）。

> **安全原则（必读）**  
> 不迁移 API Key、Token、密码、SSH 私钥、`.zsh_history`，以及 `~/.gitconfig` 里可能含凭据的内容。旧机 `.zshrc` 里若有第三方 API 环境变量，新机请用密码管理器或私有 `.env` 重新配置，**不要复制进终端 dotfiles**。清单采集日期：2026-08-08。

---

## 需要 Homebrew 吗？

**不需要。** 这份终端清单里的核心项都不依赖 Homebrew：

| 步骤 | 实际依赖 |
| --- | --- |
| Zsh | macOS 自带 |
| Oh My Zsh / p10k / 插件 | `curl` + `git`（装 **Xcode Command Line Tools** 即可） |
| Ghostty | [官网](https://ghostty.org/) 下载安装 |
| Meslo Nerd Font | 从 [Nerd Fonts](https://www.nerdfonts.com/font-downloads) 或 p10k 文档推荐链接安装到系统字体 |
| `~/.zshrc` | 不引用 `brew` |

旧机若在 `~/.zprofile` 里写了 `eval "$(brew shellenv)"`，那是为了**别的**用 Homebrew 装的 CLI 进 PATH，不是 p10k / Oh My Zsh 本身的要求。新机若只按本文配终端，**可以不装 Homebrew**，也**不必创建** `~/.zprofile`（或留空）。

若你另有「开发环境」文档会装 Homebrew，再在那时加一段 `brew shellenv` 即可（见文末可选块）。

---

## 你会得到什么样的终端

| 组件 | 选择 | 说明 |
| --- | --- | --- |
| 终端应用 | [Ghostty](https://ghostty.org/) | 字体在应用设置里选 Nerd Font |
| Shell | 系统自带 Zsh（Apple Silicon） | 不额外换 Shell |
| 框架 | Oh My Zsh | 官方 install 脚本 + `git clone` 主题/插件 |
| 提示符 | Powerlevel10k | 两行提示、Git 状态、耗时等；依赖 Nerd Font |
| 插件 | `git`、`zsh-autosuggestions`、`zsh-syntax-highlighting` | 后两者顺序固定（见下） |
| 字体 | Meslo LG S DZ Nerd Font Complete Mono | 至少装这一款；p10k 使用 `nerdfont-complete` 图标 |
| 输入体验 | Tab 补全 + 灰色历史建议 | 见下一节 |

**提示符大致长这样（细节以你的 `~/.p10k.zsh` 为准）：**

- 左侧：当前目录、Git 分支与改动；第二行 `❯`
- 右侧：退出码、长耗时命令、后台任务等（具体 segment 以你复制的 `~/.p10k.zsh` 为准）

### 输入体验：提示与补全

| 你想用的 | 机制 | 用法 |
| --- | --- | --- |
| 打命令时出现**灰色整行建议** | `zsh-autosuggestions`（历史命令） | 按 **→** 接受整段建议；继续打字可忽略灰色字 |
| **Tab** 补全路径、**当前目录下的文件名**、命令子命令 | Zsh 内置补全 + Oh My Zsh 的 `compinit` | 例如输入 `./` 或 `cd ` 后按 **Tab** 列出/补全文件；多候选时再按 Tab 可循环（见 `.zshrc` 里 `setopt`） |
| Git 子命令 / 分支等 | `git` 插件 | `git checkout ` + Tab 等 |
| 已输入命令上色 | `zsh-syntax-highlighting` | 不是预测，只是高亮 |

插件顺序（**`zsh-syntax-highlighting` 必须在最后**）：

```zsh
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
```

---

## 和旧机配置的关系：重建，而不是整包拷贝

旧机上的 `~/.zshrc`、`~/.zprofile` 里往往混有过期 PATH、**语言/runtime 初始化**和敏感环境变量。新机只应用下文「终端专用 dotfiles」，从旧机**原样复制**的通常只有：

| 文件 | 处理方式 |
| --- | --- |
| `~/.p10k.zsh` | **直接复制**（无凭据，是指外观的唯一来源） |
| `~/.zshrc` | **按本文干净版重写**，不要整文件覆盖 |
| `~/.zprofile` | 纯终端路径**可不要**；仅在你使用 Homebrew 时再加 `brew shellenv` |
| Ghostty `~/Library/Application Support/com.mitchellh.ghostty/config` | 当前无有效自定义，可忽略 |
| `.zsh_history`、各类 `.zshrc.bak*` | **不要迁移** |

**新机终端 dotfiles 里请勿照搬的遗留项：** MacPorts PATH、在 Zsh 里 `source ~/.bash_profile`、Windsurf PATH 重复写入、`RANDOM_THEME`、以及 NVM/Bun/Go/Conda/MySQL/OrbStack 等 runtime 片段（应放在单独的 dev 配置或按需追加）。

---

## 给 Agent 的总指令（可选：整段复制）

把下面整段复制给 Agent，并说明：**Apple Silicon Mac；用户会自行把旧机备份的 `~/.p10k.zsh` 放到 `$HOME`（若尚未放置，先提醒用户）。**

```markdown
任务：在 macOS（Apple Silicon）上只配置「终端体验」：Zsh、Oh My Zsh、Powerlevel10k、zsh-autosuggestions、zsh-syntax-highlighting、干净 ~/.zshrc。不要安装 Homebrew（除非用户明确要求）。不要安装 Node/Python/Go 等开发运行时。不要写入任何 API Key、Token 或 SSH 私钥。不要从用户旧机复制完整 .zshrc。

顺序：
1. 若未安装：Xcode Command Line Tools（提供 git，供 Oh My Zsh / clone 使用）。
2. 引导用户从 Ghostty 官网安装终端；不要默认 brew install ghostty。
3. 安装 Oh My Zsh（官方 install 脚本）、Powerlevel10k 主题、zsh-autosuggestions 与 zsh-syntax-highlighting 到 $ZSH_CUSTOM/plugins/。
4. 提醒用户：安装 Meslo LG S DZ Nerd Font Complete Mono，并在 Ghostty 里设为终端字体。
5. 若不存在 ~/.p10k.zsh，停止并提示用户从旧机复制；存在则继续。
6. 写入 ~/.zshrc（使用用户文档中的代码块，含 plugins 顺序与 Tab 补全 setopt）。除非用户已装 Homebrew并要求 PATH，否则不要创建含 brew shellenv 的 ~/.zprofile。
7. 验证：echo $SHELL；test -f ~/.p10k.zsh；新开终端 — 在含文件的目录对 ./ 按 Tab 能列出文件名；重复上一条历史命令时出现灰色建议。

完成后列出已装项与仍需用户手动完成的事（Ghostty、字体、.p10k.zsh）。
```

---

## 分步复制块（给 Agent 或自己执行）

### 步骤 1：Command Line Tools + Ghostty

```bash
# 需要时（会弹出图形安装）： 
xcode-select --install

# Ghostty：从 https://ghostty.org/ 下载 .dmg 安装（本清单不依赖 Homebrew）
```

### 步骤 2：Oh My Zsh、Powerlevel10k、建议与语法高亮

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"
git clone https://github.com/zsh-users/zsh-autosuggestions "${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions"
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git "${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting"
```

### 步骤 3：写入 `~/.zshrc`（终端专用）

```zsh
export LANG="en_US.UTF-8"
export LC_ALL="en_US.UTF-8"

export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="powerlevel10k/powerlevel10k"
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

# Tab：当前目录文件、路径、命令候选（依赖 Oh My Zsh 已执行的 compinit）
setopt AUTO_LIST AUTO_MENU COMPLETE_IN_WORD

# Powerlevel10k 外观（需已存在 ~/.p10k.zsh）
[[ -r "$HOME/.p10k.zsh" ]] && source "$HOME/.p10k.zsh"
```

> 旧机 `.zshrc` 曾同时设 `ZSH_THEME="simple"` 又加载 `.p10k.zsh`，容易混淆。新机只保留 Powerlevel10k 主题一行。

### 步骤 4：验收清单

```bash
echo "SHELL=$SHELL"
command -v zsh && zsh --version
command -v git && git --version
test -d "$HOME/.oh-my-zsh/custom/plugins/zsh-autosuggestions" && echo "autosuggestions: OK"
test -d "$HOME/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting" && echo "syntax-highlighting: OK"
test -f "$HOME/.p10k.zsh" && echo "p10k config: OK" || echo "p10k config: MISSING — copy from old Mac"
```

新开 Ghostty 窗口，确认：

- Meslo Nerd Font 已选、提示符两行显示、Git 仓库内能看到分支/状态
- 在任意有文件的目录：输入 `./` 再 **Tab**，能看到当前目录文件名
- 输入以前跑过的命令开头，出现**灰色**历史建议，**→** 可接受

---

### 可选：已装 Homebrew 时再写入 `~/.zprofile`

与终端主题无关；仅当你用 Homebrew 管理其他软件、希望登录 shell 里就有 `/opt/homebrew/bin` 时使用：

```zsh
if [[ -x /opt/homebrew/bin/brew ]]; then
  eval "$(/opt/homebrew/bin/brew shellenv)"
fi
```

---

## 补全与高亮（终端范围内）

| 功能 | 来源 |
| --- | --- |
| Tab 补全路径 / **当前目录文件** | Zsh `compinit`（Oh My Zsh 启用）+ 上文 `setopt AUTO_LIST AUTO_MENU` |
| Git 命令补全 | `git` 插件 |
| 灰色历史建议 | `zsh-autosuggestions`（**→** 接受） |
| 输入语法高亮 | `zsh-syntax-highlighting`（须在 plugins 最后） |

