# 宝塔部署说明

本项目推荐拆成三部分部署：

1. `API` 用 `Node.js + PM2` 运行
2. `admin-web` 作为静态站点交给 `Nginx`
3. `mobile-h5` 作为静态站点交给 `Nginx`

## 一键部署

服务器环境准备：

- `Nginx`
- `Node.js`
- `Git`
- `PM2`
- `pnpm`

推荐项目目录：

- `/www/wwwroot/yingzi`

如果你已经把仓库推到 GitHub，可以直接在服务器执行：

```bash
cd /www/wwwroot/yingzi
bash deploy/baota-onekey.sh \
  --api-domain api.example.com \
  --admin-domain admin.example.com \
  --mobile-domain m.example.com \
  --jwt-secret "replace-with-a-strong-secret"
```

脚本会自动完成：

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

## 生成后的域名配置

脚本会自动生成：

1. API 域名配置
2. 管理后台域名配置
3. 用户端 H5 域名配置

其中管理后台和用户端都包含：

- `SPA` 刷新回退
- `/api/` 反向代理到后端 API

## 自动更新

部署成功后，后续更新有两种方式。

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

你可以复制成服务器上的真实文件：

```bash
cp /www/wwwroot/yingzi/deploy/update.sh.example /www/wwwroot/yingzi/deploy/update.sh
chmod +x /www/wwwroot/yingzi/deploy/update.sh
```

然后每次执行：

```bash
/www/wwwroot/yingzi/deploy/update.sh
```

也可以把它挂到：

- 宝塔计划任务
- GitHub Webhook 接收器

## SSL

脚本不会自动申请 SSL。

部署完成后请在宝塔面板中：

1. 给 `api`、`admin`、`mobile` 三个域名申请证书
2. 开启强制 HTTPS

## 注意事项

1. 当前数据仍以本地内存数据为主，服务重启后会回到初始演示数据。
2. 生产环境务必替换 `JWT_SECRET`。
3. 如需接入 MySQL、Redis、对象存储，建议在下一轮部署前补充环境变量与服务配置。
