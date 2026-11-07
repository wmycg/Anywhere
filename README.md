# Codebase Relationship Map

一个面向源码阅读的 Agent Skill：从指定入口追踪代码，将类、方法、数据模型、外部数据源和它们之间的关系组织成可交互的地图。它适合阅读跨模块流程，也适合需要看清数据在哪里产生、如何转换、最后被谁使用的项目。

Skill 不绑定 AstrBot 或某一种编程语言。分析时以目标仓库的源码为依据，区分实际调用、继承、持有、数据包装等关系；遇到无法确认的动态调用时明确标注，而不是凭名称猜测。

## 包含什么

```text
skills/codebase-relationship-map/
  SKILL.md                 # 跨 Agent 使用的技能指令
  agents/openai.yaml       # Codex 可选界面元数据
examples/astrbot-core/     # 基于 AstrBot Core 的交互式样例
```

地图中的每个节点只表示一个源码实体或明确标注的外部边界。点击节点可查看职责、执行逻辑、字段、方法、数据与上下游关系；点击或展开关系可查看触发条件、处理步骤、数据包装和源码位置。对于重要的数据构建方法，也可以单独建立节点。初始化关系在需要时可另设视图，以免遮挡运行主流程。

## 安装技能

先克隆此仓库，再将 `skills/codebase-relationship-map` 整个目录放入 Agent 支持的技能目录。下面的目录均为用户级位置；具体工具版本和配置可能使用不同位置。

| Agent | 可使用的用户级技能目录 |
| --- | --- |
| Codex | `~/.codex/skills/` |
| Claude Code | `~/.claude/skills/` |
| Cursor | `~/.cursor/skills/`，或其支持的 Claude Code 用户技能目录 |
| OpenCode | `~/.config/opencode/skills/`，或 `~/.agents/skills/` |
| DeepSeek Harness | `~/.dsh/skills/`，或 `~/.agents/skills/` |

例如，在 Windows PowerShell 中安装到通用目录（适用于支持该目录的工具）：

```powershell
git clone https://github.com/wmycg/Anywhere.git
cd Anywhere
$skillRoot = Join-Path $HOME '.agents/skills'
New-Item -ItemType Directory -Force -Path $skillRoot | Out-Null
if (Test-Path -LiteralPath (Join-Path $skillRoot 'codebase-relationship-map')) { throw 'Skill already exists; inspect it before replacing it.' }
Copy-Item -Recurse -LiteralPath 'skills/codebase-relationship-map' -Destination $skillRoot
```

在 macOS 或 Linux 上：

```sh
git clone https://github.com/wmycg/Anywhere.git
cd Anywhere
mkdir -p "$HOME/.agents/skills"
test ! -e "$HOME/.agents/skills/codebase-relationship-map" || { echo 'Skill already exists; inspect it first.'; exit 1; }
cp -R skills/codebase-relationship-map "$HOME/.agents/skills/"
```

如果使用 Codex、Claude Code 或 Cursor 的其他目录，将上述目标目录替换为表中对应位置。安装后重启 Agent，或按其文档刷新技能列表。多工具同时安装时，注意避免同名技能被重复发现；可以由用户自行使用目录链接维护单一内容源。`SKILL.md` 是通用入口，`agents/openai.yaml` 仅提供 Codex 的可选元数据。

## 使用示例

在目标项目中向 Agent 提出具体范围，例如：

> 使用 `codebase-relationship-map` 分析消息处理主流程。从入口追踪到最终输出，标出配置、外部数据、关键类和方法，并在节点详情中解释数据如何包装及传递。

也可以指定入口文件、关注模块、期望输出格式或需要完整覆盖的范围。交互式地图默认可生成为独立 HTML；是否覆盖整个项目取决于请求范围和实际完成的源码追踪。

## AstrBot 测试样例

[查看样例说明](examples/astrbot-core/README.md)。样例记录了 AstrBot Core 的一个源码快照，包含 90 个节点、139 条关系及节点详解。仓库内的 [index.html](examples/astrbot-core/index.html) 是可离线打开的交互页面；GitHub 文件页面通常显示 HTML 源码，需要克隆后在浏览器中打开才能交互。

样例的节点和连线是人工整理的源码阅读资料，不是对整个项目的完整覆盖证明。AstrBot 的来源、版本、验证方式和局限见样例说明。
