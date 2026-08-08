---
title: "在新 Mac 上复刻我的终端环境"
date: "2026-08-08"
tags: ["prompt","开发"]
---

这是一份**可复现的终端配置清单**：Shell、终端应用、提示符主题、Zsh 插件与字体。方便换机或重装时恢复同样的终端体验。

**你可以这样用本文：**

1. **先读正文** — 了解会装什么、需要从旧机带什么。
2. **再复制给 Agent** — 把「Agent 总指令」或分步代码块贴给 Cursor / Claude Code 等，在新机上按顺序执行。
3. **手动迁移外观** — 从旧机复制 `~/.p10k.zsh` 到 `$HOME`（**不要**提交到公开仓库）。

> **安全原则**  
> 不迁移 API Key、Token、密码、SSH 私钥、`.zsh_history`，以及 `~/.gitconfig` 里可能含凭据的内容。敏感环境变量请在新机单独配置，不要写进 `~/.zshrc`。清单采集日期：2026-08-08。

---

## 你会得到什么样的终端

| 组件 | 选择 | 说明 |
| --- | --- | --- |
| 终端应用 | [Ghostty](https://ghostty.org/) | 官网下载；字体在应用设置里选 Nerd Font |
| Shell | 系统自带 Zsh（Apple Silicon） | — |
| 框架 | Oh My Zsh | 官方 install 脚本 + `git clone` |
| 提示符 | Powerlevel10k | 两行提示、Git 状态、耗时等 |
| 插件 | `git`、`zsh-autosuggestions`、`zsh-syntax-highlighting` | 顺序见下 |
| 字体 | Meslo LG S DZ Nerd Font Complete Mono | [Nerd Fonts](https://www.nerdfonts.com/font-downloads) 安装到系统 |
| 前置依赖 | Xcode Command Line Tools | 提供 `git`，供 Oh My Zsh 与插件 clone |

**提示符大致长这样（细节以 `~/.p10k.zsh` 为准）：**

- 左侧：当前目录、Git 分支与改动；第二行 `❯`
- 右侧：退出码、长耗时命令、后台任务等

### 输入体验：提示与补全

| 能力 | 来源 | 用法 |
| --- | --- | --- |
| 灰色整行建议 | `zsh-autosuggestions` | 按 **→** 接受；继续打字可忽略灰色字 |
| Tab 补全路径、当前目录文件名 | Zsh + Oh My Zsh `compinit` | `./` 或 `cd ` 后按 **Tab** |
| Git 子命令 / 分支 | `git` 插件 | `git checkout ` + Tab |
| 命令语法高亮 | `zsh-syntax-highlighting` | 着色已输入内容 |

插件顺序（**`zsh-syntax-highlighting` 必须在最后**）：

```zsh
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
```

---

## 从旧机带什么

| 文件 | 处理 |
| --- | --- |
| `~/.p10k.zsh` | **直接复制**（外观配置，无凭据） |
| `~/.zshrc` | **按本文步骤 3 重写**，不要整文件覆盖 |
| `.zsh_history`、`.zshrc.bak*` | **不要迁移** |

---

## 给 Agent 的总指令（可选：整段复制）

把下面整段复制给 Agent，并说明：**Apple Silicon Mac；`~/.p10k.zsh` 已放到 `$HOME`（若尚未放置，先提醒用户）。**

```markdown
任务：在 macOS（Apple Silicon）上配置终端：Zsh、Oh My Zsh、Powerlevel10k、zsh-autosuggestions、zsh-syntax-highlighting，写入干净 ~/.zshrc。不要写入 API Key、Token 或 SSH 私钥。不要从用户旧机复制完整 .zshrc。

顺序：
1. 若未安装：Xcode Command Line Tools。
2. 引导用户从 Ghostty 官网安装终端。
3. 安装 Oh My Zsh、Powerlevel10k、zsh-autosuggestions、zsh-syntax-highlighting。
4. 提醒用户安装 Meslo Nerd Font，并在 Ghostty 里设为终端字体。
5. 若不存在 ~/.p10k.zsh，停止并提示用户从旧机复制；存在则继续。
6. 写入 ~/.zshrc（使用用户文档步骤 3 的代码块）。
7. 验证：新开终端 — 对 ./ 按 Tab 能列出文件名；重复历史命令时出现灰色建议；Git 仓库内提示符显示分支。

完成后列出已装项与仍需用户手动完成的事（Ghostty、字体、.p10k.zsh）。
```

---

## 分步复制块（给 Agent 或自己执行）

### 步骤 1：Command Line Tools + Ghostty

```bash
# 需要时（会弹出图形安装）：
xcode-select --install

# Ghostty：https://ghostty.org/ 下载 .dmg 安装
```

### 步骤 2：Oh My Zsh、Powerlevel10k、建议与语法高亮

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"
git clone https://github.com/zsh-users/zsh-autosuggestions "${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions"
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git "${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting"
```

### 步骤 3：写入 `~/.zshrc`

```zsh
export LANG="en_US.UTF-8"
export LC_ALL="en_US.UTF-8"

export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="powerlevel10k/powerlevel10k"
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
source "$ZSH/oh-my-zsh.sh"

# Tab：当前目录文件、路径、命令候选
setopt AUTO_LIST AUTO_MENU COMPLETE_IN_WORD

# Powerlevel10k 外观（需已存在 ~/.p10k.zsh）
[[ -r "$HOME/.p10k.zsh" ]] && source "$HOME/.p10k.zsh"
```

### 步骤 4：验收

```bash
echo "SHELL=$SHELL"
command -v zsh && zsh --version
command -v git && git --version
test -d "$HOME/.oh-my-zsh/custom/plugins/zsh-autosuggestions" && echo "autosuggestions: OK"
test -d "$HOME/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting" && echo "syntax-highlighting: OK"
test -f "$HOME/.p10k.zsh" && echo "p10k config: OK" || echo "p10k config: MISSING — copy from old Mac"
```

新开 Ghostty 窗口，确认：

- Meslo Nerd Font 已选；提示符两行显示；Git 仓库内能看到分支/状态
- 有文件的目录：`./` + **Tab** 能列出文件名
- 输入曾跑过的命令开头，出现灰色建议，**→** 可接受
