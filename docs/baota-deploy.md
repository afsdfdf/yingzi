# 宝塔部署说明

本项目推荐拆分为三部分部署：

1. `API` 使用 `Node.js + PM2` 运行
2. `admin-web` 作为静态站点交给 `Nginx`
3. `mobile-h5` 作为静态站点交给 `Nginx`

## 一键部署前提

服务器建议提前准备：

- `Nginx`
- `Node.js`
- `Git`
- `PM2`
- `pnpm`

推荐项目目录：

- `/www/wwwroot/yingzi`

如果代码已经推送到 GitHub，可在服务器执行：

```bash
cd /www/wwwroot/yingzi
bash deploy/baota-onekey.sh \
  --api-domain api.example.com \
  --admin-domain admin.example.com \
  --mobile-domain m.example.com \
  --jwt-secret "replace-with-a-strong-secret"
```

## 一键部署脚本会做什么

脚本会自动完成以下工作：

1. 拉取最新代码
2. 安装依赖
3. 构建整个工作区
4. 写入 `apps/api/.env.production`
5. 生成 Linux 可用的 `PM2` 配置
6. 启动 `yingzi-api`
7. 生成 3 个域名的 `Nginx` 配置
8. 测试并重载 `Nginx`

脚本位置：

- [baota-onekey.sh](/D:/yingzi/deploy/baota-onekey.sh)

## 域名规划建议

建议使用三个域名：

1. API 域名
2. 管理后台域名
3. 用户端 H5 域名

其中管理后台和用户端站点都建议带上：

- `SPA` 刷新回退配置
- `/api/` 反向代理到后端 API

## 后续更新方式

### 方式一：重复执行一键部署脚本

每次发布时重新执行：

```bash
cd /www/wwwroot/yingzi
bash deploy/baota-onekey.sh \
  --api-domain api.example.com \
  --admin-domain admin.example.com \
  --mobile-domain m.example.com \
  --jwt-secret "replace-with-a-strong-secret"
```

### 方式二：使用更新脚本

示例文件：

- [update.sh.example](/D:/yingzi/deploy/update.sh.example)

可以复制成服务器上的真实更新脚本：

```bash
cp /www/wwwroot/yingzi/deploy/update.sh.example /www/wwwroot/yingzi/deploy/update.sh
chmod +x /www/wwwroot/yingzi/deploy/update.sh
```

之后每次更新执行：

```bash
/www/wwwroot/yingzi/deploy/update.sh
```

也可以挂到：

- 宝塔计划任务
- GitHub Webhook 接收器

## SSL

一键脚本不会自动申请 SSL。

部署完成后请在宝塔中：

1. 给 `api`、`admin`、`mobile` 对应域名申请证书
2. 开启强制 `HTTPS`

## 注意事项

1. 当前后端部分数据仍以内存演示数据为主，服务重启后会恢复到初始状态。
2. 生产环境必须替换 `JWT_SECRET`。
3. 如需接入 `MySQL`、`Redis`、对象存储等，请在下一轮部署前补充环境变量和服务配置。
