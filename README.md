# airport-config

多平台代理软件覆写配置，为机场订阅提供统一的节点分组、规则集与分流策略。同一套逻辑可按客户端差异，用 **JavaScript 覆写（FlClash）** 或 **完整 YAML 模板（CMA）** 落地。

## 支持客户端

| 客户端 | 版本 | 内核 | 覆写方式 |
|--------|------|------|----------|
| FlClash | 0.8.92 | mihomo (Clash Meta) | JS 覆写脚本 |
| ClashMetaForAndroid | 2.11.25 | mihomo (Clash Meta) | YAML 配置导入 |

## 目录结构

```
clients/
├── flclash/
│   └── config.js        # FlClash JS 覆写脚本
└── cma/
    └── override.yaml    # CMA 完整配置模板（含订阅与策略）
```

## 工作原理（FlClash）

FlClash 会在**当前配置**下把已启用的订阅合并成完整 Clash 配置后，再调用覆写脚本的 `main(config)`。

本仓库的 `clients/flclash/config.js` 会重写 `proxy-groups`、`rule-providers` 与 `rules`。其中地区类策略组使用 `include-all: true` 与正则 `filter`，从**当前合并结果里的全部节点**中筛选，**不会**按「来自哪个机场」分别处理——只要节点名匹配对应地区关键词，就会进入该组。

因此：**一份脚本文件描述的是「策略模板」**；真正参与匹配的节点集合，由你在该配置里勾选了哪些订阅决定。

<a id="multi-airport"></a>

## 多机场 / 多订阅：如何用一份脚本覆盖多个源

### 做法一：单配置 + 多个订阅（最省事）

1. 在 FlClash 里只维护**一个**「配置」profile。
2. 在该配置下添加多个机场的订阅链接（或本地订阅）。
3. 对该配置**启用**本仓库的覆写脚本（工具 → 进阶配置 → 脚本 → 绑定到该配置）。

所有订阅拉下来的节点会一起进入合并后的 `config`，脚本的「延迟优先」、各地区 `url-test`、`手动切换` 等组都会覆盖**全部**这些节点。

### 做法二：多个配置，各用同一份脚本

若你希望每个机场单独一个 FlClash「配置」（便于切换或隔离），在每个配置里**分别**启用覆写脚本，粘贴或引用**同一份** `config.js` 内容即可。每个配置在运行脚本时仍只看到**自己**下面的订阅节点，策略逻辑一致、数据互不混入。

### 使用上需注意

- **地区分组依赖节点名**：只有名称里带有脚本中定义的关键词（如港、日、美、`JP` 等）的节点才会进入对应地区组；命名特殊的节点仍会出现在「延迟优先」「手动切换」等不限地区的组中。
- **重名节点**：若多个订阅产生同名代理，具体表现取决于客户端合并规则；若出现异常，可在机场侧或客户端中区分节点显示名/前缀。

更细的开发约定见仓库根目录 [`AGENTS.md`](./AGENTS.md)。

## ClashMetaForAndroid 与多机场

`clients/cma/override.yaml` 是**完整配置**：策略组已使用 `include-all-providers: true`，会从 **`proxy-providers` 下所有订阅源** 拉取节点。

多机场时：在 `proxy-providers` 中**增加多个条目**（不同名称、不同 `url`、不同 `path`），无需改 `proxy-groups` 定义即可共享同一套分组与规则。若坚持「一机场一文件」，可复制多份 YAML，分别替换各文件中的订阅地址后分别导入。

## 分组策略

| 分组 | 类型 | 用途 |
|------|------|------|
| 节点选择 | select | 主路由入口 |
| 延迟优先 | url-test | 全节点按延迟自动选优 |
| AI节点 | select | Claude / ChatGPT / Gemini |
| 香港节点 | url-test | 香港节点自动选优 |
| 日本节点 | url-test | 日本节点自动选优 |
| 新加坡节点 | url-test | 新加坡节点自动选优 |
| 美国节点 | url-test | 美国节点自动选优 |
| 手动切换 | select | 全节点手动选择 |
| 广告拦截 | select | REJECT 广告和追踪 |
| 漏网之鱼 | select | 未匹配流量兜底 |

## 使用方式

### FlClash

1. 打开 FlClash → **工具** → **进阶配置** → **脚本**。
2. 新建脚本，将 `clients/flclash/config.js` 全文粘贴保存。
3. 在 **配置** 页面，对需要统一策略的配置**启用该脚本**。

多订阅、多机场场景请优先阅读上文 [多机场 / 多订阅](#multi-airport)。

### ClashMetaForAndroid

1. 将 `clients/cma/override.yaml` 中 `proxy-providers` 的订阅 `url` 改为你的机场地址；多机场则增加多个 `proxy-providers` 条目。
2. 将修改后的 YAML 导入 CMA 作为配置。

## 规则集

基于 [ACL4SSR](https://github.com/ACL4SSR/ACL4SSR) 规则集，通过 jsDelivr CDN（`testingcf.jsdelivr.net`）拉取。
