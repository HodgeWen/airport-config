# airport-config

多平台代理软件覆写脚本项目，为机场订阅提供自定义的节点分组、规则集和高效内核配置。

## 常用命令

```bash
# 无构建流程；配置文件由代理客户端直接加载
# 规则集通过 HTTP 远程拉取，无需本地构建
```

## 目录结构

```text
airport-config/
├── AGENTS.md
├── README.md
├── LICENSE
└── clients/                  # 按客户端组织
    ├── flclash/              # FlClash (Android/多平台)
    │   └── config.js         # FlClash 覆写脚本
    ├── cma/                  # ClashMetaForAndroid
    │   └── override.yaml     # CMA 完整配置（含订阅与策略）
    └── ...                   # 后续扩展：Sing-box 系、iOS 端等
```

## 技术栈

| 项 | 值 |
|---|---|
| 覆写脚本语言 | JavaScript (ES2022+) |
| 当前支持客户端 | FlClash 0.8.92, ClashMetaForAndroid 2.11.25 |
| 内核 | Clash Meta (mihomo) |
| 规划支持平台 | Clash 系 / Sing-box 系 / iOS 端 (Shadowrocket, Surge 等) |
| 规则集来源 | ACL4SSR, 按需扩展 |

## 代理分组策略

| 分组 | 用途 |
|---|---|
| AI 节点 | Claude / ChatGPT / Gemini 等 AI 服务 |
| 日本组 | 日本节点自动选优 |
| 新加坡组 | 新加坡节点自动选优 |
| 香港组 | 香港节点自动选优 |
| 美国组 | 美国节点自动选优 |
| 延迟优先 | 全部节点按延迟自动选优 |
| 广告拦截 | REJECT 广告和追踪 |
| 漏网之鱼 | 兜底策略（未匹配流量） |

## 代码规范

- 覆写脚本导出 `main(config)` 函数，接收原始配置并返回修改后的配置
- 使用最新的脚本语法和内核特性，追求高效配置
- 正则匹配节点名时使用 `(?i)` 忽略大小写
- 规则集 URL 使用 CDN 加速地址 (testingcf.jsdelivr.net)
- 文件命名：FlClash 覆写脚本为 `config.js`；CMA 等完整 YAML 导入使用约定名（如 `override.yaml`），放在对应客户端目录下

## 开发偏好

- **激进策略**：优先使用最新的语法、内核特性和配置选项
- **规则正确性优先**：确保分流规则准确、无遗漏
- **效率导向**：选择性能最优的匹配模式和分组策略
