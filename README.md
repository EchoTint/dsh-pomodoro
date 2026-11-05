# DSH Pomodoro · 番茄钟 v0.1.0

DSH 插件，提供侧栏计时工作台和独立桌面悬浮窗。支持番茄倒计时、正计时、心流计时、任务与子步骤、专注统计、复盘、种树奖励，以及 WebDAV / S3 备份。

Pomodoro timer for DeepSeek Harness with a sidebar workspace, desktop widgets, task tracking, focus statistics, and WebDAV/S3 backups.

## 安装

兼容 **DSH 0.2.2-rc.1**。在 DSH 插件管理中安装以下 GitHub Release 包并启用：

```text
https://github.com/EchoTint/dsh-pomodoro/releases/download/v0.1.0/dsh-pomodoro.tgz
```

也可把 `https://github.com/EchoTint/dsh-pomodoro` 作为 GitHub 仓库安装源。仓库包含可直接加载的 JavaScript、`dsh.bundle` 清单和 Cordis patch，无需构建。未发布到 npm；包名为 `@echotint/dsh-pomodoro`。

启用后，左侧栏出现「番茄钟」。计时、统计、任务和设置在该入口管理。桌面悬浮窗需要额外准备 Electron，见下文。

从本地开发版 `@local/pomodoro` 切换时，先停用旧版再启用本包，避免两个实例同时写入。业务数据沿用 `$DSH_HOME/pomodoro`；自定义设置可先在旧版导出或记下，再在新版核对。两个包的标准 Config 条目不同，不会自动复制 profile 中的显式设置。

## 功能

- 倒计时包含专注、短休息和长休息；正计时与心流模式可随时结束并记录。提前结束的倒计时记录实际专注时长。
- 任务支持优先级、预估番茄数和子步骤；专注记录可补写能量等级与复盘笔记。
- 统计包含时间线、小时分布、近 7 日趋势、年度热力图与每日目标。
- 环境音由 Web Audio 合成，包含雨声、篝火、海浪和双耳节拍。
- 专注达标可种树，林地提供 8 种植物及逐步解锁。
- 桌面悬浮窗提供小卡 `220×84`、圆环 `108×108`、纯时间 `128×56` 三种形态，支持拖动、置顶、不透明度和日夜主题。悬停显示操作，右键切换阶段与计时方向。
- WebDAV 和 S3 兼容存储用于手动或自动备份；支持 JSON 导出与导入。备份不会自动进行多端合并。

## Electron 桌面悬浮窗

插件不捆绑或自动下载 Electron。从 [Electron 官方发布页](https://github.com/electron/electron/releases) 获取适合系统和架构的完整发行目录并解压，保留配套资源。Windows 已验证 Electron **43.3.0**；其他版本及 macOS / Linux 桌面行为尚未实测。

在启动 DSH 前设置可执行文件路径，例如 PowerShell：

```powershell
$env:DSH_POMODORO_ELECTRON = 'C:\Tools\Electron\electron.exe'
# 从继承该环境变量的进程启动 DSH。
```

未设置时，插件查找以下位置。`$DSH_HOME` 默认是用户目录下的 `.dsh`。

| 系统 | 默认路径 |
| --- | --- |
| Windows | `$DSH_HOME/electron/electron.exe` |
| macOS | `$DSH_HOME/electron/Electron.app/Contents/MacOS/Electron` |
| Linux | `$DSH_HOME/electron/electron` |

没有 Electron 时仍可使用侧栏；开启悬浮窗失败时，设置页会显示错误。Linux 还需要图形会话和 Electron 系统依赖。

## 设置与数据

计时、音效、悬浮窗及非敏感备份目标通过 DSH 标准 `Config` 和 `ctx.configEditor.edit()` 保存。普通配置提交会由 Loader 重启插件，运行状态在提交前保存。旧版文件中的设置可迁移到当前条目，显式 profile 值优先。

任务、专注记录、复盘与林地保存在 `$DSH_HOME/pomodoro/data.json`，计时与窗口运行状态保存在 `state.json`。旧数据的格式版本与软件版本独立，发布为 v0.1.0 不会降低数据格式版本。

WebDAV 密码和 S3 secretKey 通过 `ctx.credentials` 存入 `pomodoro/webdav`、`pomodoro/s3`。旧明文先写入并读回验证，全部成功后才清除，失败可重试。空密码输入保留已有凭据；每次上传重新读取凭据，导出不包含密码。实际落盘保护取决于宿主凭据 provider。

普通控件使用 DSH 主题 token；界面与桌面文案跟随 DSH 语言。森林插画与阶段强调色保留艺术配色。本机 HTTP 接口验证 loopback、Host 与浏览器 Origin，不供公网使用。

## 开发与验证

必需宿主 peer：`@deepseek-ai/schemastery@3.19.0`、`@deepseek-ai/dsh-credentials@0.2.2-rc.1`。React 由 DSH Client 提供，Electron helper 是独立 CommonJS 应用。不要把宿主包复制进插件。

Node.js 24 可运行纯逻辑和打包检查，无需安装依赖：

```bash
node --test core.test.mjs packaging.test.mjs
node scripts/runtime-check.mjs
node scripts/runtime-check.mjs --pack --pnpm /absolute/path/to/pnpm.mjs
```

打包检查禁用生命周期脚本，在临时目录生成并解包 `.tgz`，验证资源、导入、源码一致性，并在无 `node_modules` 的目录运行测试。产物不包含个人数据或凭据。

在已安装的 Windows DSH Desktop 中，可用真实宿主 peer 运行完整测试。将路径替换为本机实际安装位置：

```powershell
$env:ELECTRON_RUN_AS_NODE = '1'
$env:DSH_TEST_RUNTIME_ROOT = 'C:\path\to\resources\app.asar\dsh'
$test = Start-Process 'C:\path\to\electron.exe' -ArgumentList '--import','./scripts/host-imports.mjs','--test','core.test.mjs','compliance.test.mjs','packaging.test.mjs' -Wait -NoNewWindow -PassThru
exit $test.ExitCode
```

完整测试覆盖计时、统计、凭据迁移与失败重试、配置编辑、deadline 保留及 HTTP 边界。凭据服务用 mock 注入，不操作个人凭据。Windows 已验证 Electron 43.3.0 / Node 24.18.1；真实远端 WebDAV / S3 账户尚未实测。GitHub CI 运行无宿主的测试与打包检查，不代表跨平台桌面验证。

## License

[MIT](LICENSE).
