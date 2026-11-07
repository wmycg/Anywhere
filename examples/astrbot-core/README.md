# AstrBot Core 样例

这是 `codebase-relationship-map` 对 AstrBot Core 消息处理和关联代码的一份示例地图，用于展示 Skill 可以交付的内容，以及供后续修改地图时进行回归检查。

## 范围和来源

- 源码快照：[wmycg/AstrBot 的 `dad255c60f7983fd63c7c0282ded1dde859fbc9a`](https://github.com/wmycg/AstrBot/tree/dad255c60f7983fd63c7c0282ded1dde859fbc9a)。
- 主要追踪平台输入、统一事件、配置路由、Pipeline、Agent、Provider、工具和 MCP、结果发送，以及相关的定时任务、持久化和外部边界。
- 地图包含 90 个节点和 139 条关系；所有节点有独立说明。平台适配器以代表实现为例，不代表完整枚举，其他未追踪路径也不在覆盖范围内。
- 仓库保存的是地图数据、说明和页面生成代码，不包含 AstrBot 项目源码。AstrBot 仓库使用 AGPL-3.0，请参考其仓库中的许可证。

地图对应固定提交，后续版本中的实现和行号可能发生变化。自动检查可以验证结构、源文件路径和行号范围，但不能证明所有人工归纳的语义完全正确。

## 打开和阅读

克隆本仓库后，用浏览器打开本目录的 `index.html`。页面不需要安装依赖或启动服务；源码链接指向上面的 GitHub 提交，因此打开源码链接需要网络。

从 `InitialLoader` 开始沿启动、平台、EventBus、Pipeline 和 Agent 追踪。点击节点可查看职责、步骤、数据和上下游关系；展开关系可以在当前侧边栏内阅读调用顺序与数据变换，也可以跳转到关联节点。顶部支持搜索、模块筛选、主链和一跳聚焦；画布支持拖动和缩放。

## 文件

| 文件 | 用途 |
| --- | --- |
| `model.json` | 节点、关系、分组和对应源码位置 |
| `notes-events.json` | 启动、平台、事件和流水线节点详解 |
| `notes-agent.json` | Agent、Provider、工具和 MCP 节点详解 |
| `notes-output.json` | 结果、定时任务、数据存储与外部边界详解 |
| `template.html` | 页面模板与交互代码 |
| `build.mjs` | 校验节点和关系并将数据嵌入 HTML |
| `index.html` | 生成好的独立页面 |
| `map.test.mjs` | 示例结构、关键关系和生成结果的回归检查 |

## 重新生成和检查

需要 Node.js 18 或更新版本，无需安装 npm 包。在本目录执行：

```sh
node build.mjs
node --test map.test.mjs
```

默认测试检查节点与连线、说明覆盖、几个关键关系和 HTML 是否与输入一致；不会自动下载或分析 AstrBot 源码。若本机已有上述提交的 AstrBot 检出，可额外设置 `ASTRBOT_SOURCE`，测试会检查版本、引用文件及行号范围：

```powershell
$env:ASTRBOT_SOURCE = 'C:\path\to\AstrBot'
node --test map.test.mjs
Remove-Item Env:ASTRBOT_SOURCE
```

```sh
ASTRBOT_SOURCE=/path/to/AstrBot node --test map.test.mjs
```

这不是对 AstrBot 运行时行为的测试，也不保证浏览器交互在所有设备上均已验证。
