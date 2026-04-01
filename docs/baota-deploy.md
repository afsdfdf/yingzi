# 宝塔部署说明

本项目推荐按宝塔常见方式拆成三部分部署：

1. `API` 用 Node + PM2 运行
2. `admin-web` 构建成静态站点
3. `mobile-h5` 构建成静态站点

## 一、服务器准备

宝塔面板建议安装：

- `Nginx`
- `Node.js 运行环境`
- `PM2 管理器` 或可执行 `npm install -g pm2`

建议目录：

- 项目代码：`/www/wwwroot/yingzi`
- 管理端站点：`/www/wwwroot/yingzi-admin`
- 用户端站点：`/www/wwwroot/yingzi-mobile`

## 二、上传项目

把整个项目上传到：

- `/www/wwwroot/yingzi`

进入项目根目录执行：

```bash
pnpm install
pnpm build
```

## 三、启动后端 API

后端目录：

- `/www/wwwroot/yingzi/apps/api`

先准备环境变量：

```bash
cp .env.production.example .env.production
```

修改：

- `PORT`
- `JWT_SECRET`

### 方式 A：宝塔 PM2 管理器

启动目录：

- `/www/wwwroot/yingzi/apps/api`

启动命令：

```bash
node dist/index.js
```

环境变量至少设置：

- `NODE_ENV=production`
- `HOST=0.0.0.0`
- `PORT=3002`
- `JWT_SECRET=你的生产密钥`

### 方式 B：使用 PM2 配置文件

配置文件位置：

- [ecosystem.config.cjs](/D:/yingzi/deploy/pm2/ecosystem.config.cjs)

使用前把 `cwd` 和 `JWT_SECRET` 改成服务器实际值，然后执行：

```bash
pm2 start deploy/pm2/ecosystem.config.cjs
pm2 save
```

## 四、部署管理端

构建产物目录：

- `/www/wwwroot/yingzi/apps/admin-web/dist`

把 `dist` 内文件复制到：

- `/www/wwwroot/yingzi-admin`

宝塔新建站点：

- 域名示例：`admin.yourdomain.com`
- 根目录：`/www/wwwroot/yingzi-admin`

如果需要 API 代理，可在站点配置里加入：

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3002;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 五、部署用户端 H5

构建产物目录：

- `/www/wwwroot/yingzi/apps/mobile-h5/dist`

把 `dist` 内文件复制到：

- `/www/wwwroot/yingzi-mobile`

宝塔新建站点：

- 域名示例：`m.yourdomain.com`
- 根目录：`/www/wwwroot/yingzi-mobile`

同样需要 API 代理：

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3002;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 六、当前推荐端口

- API：`3002`
- 管理端：由 Nginx 站点直接提供静态文件
- 用户端：由 Nginx 站点直接提供静态文件

## 七、发布顺序

1. 上传新代码
2. `pnpm install`
3. `pnpm build`
4. 用宝塔或 PM2 重启 API
5. 覆盖管理端静态文件
6. 覆盖用户端静态文件
7. 浏览器验证首页、登录、API 代理

## 八、当前注意点

- `admin-web` 和 `mobile-h5` 现在都是前端静态站点，最适合放到宝塔 Nginx 站点目录。
- `api` 是 Node 服务，建议不要直接暴露端口到公网，优先通过 Nginx 反代。
- 后续如果接 MySQL、Redis，再在宝塔中补数据库和缓存服务配置。
