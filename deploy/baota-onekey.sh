#!/bin/bash
set -euo pipefail

PROJECT_DIR="/www/wwwroot/yingzi"
REPO_URL="https://github.com/afsdfdf/yingzi.git"
BRANCH="main"
API_DOMAIN=""
ADMIN_DOMAIN=""
MOBILE_DOMAIN=""
JWT_SECRET=""
API_PORT="3000"
BT_NGINX_DIR="/www/server/panel/vhost/nginx"

print_help() {
  cat <<'EOF'
影子护卫宝塔一键部署脚本

用法:
  bash deploy/baota-onekey.sh \
    --api-domain api.example.com \
    --admin-domain admin.example.com \
    --mobile-domain m.example.com \
    --jwt-secret "your-secret"

可选参数:
  --project-dir   项目目录，默认 /www/wwwroot/yingzi
  --repo          Git 仓库地址
  --branch        Git 分支，默认 main
  --api-port      API 端口，默认 3000
  --bt-nginx-dir  宝塔 Nginx 配置目录，默认 /www/server/panel/vhost/nginx
  --help          显示帮助
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --project-dir)
      PROJECT_DIR="$2"
      shift 2
      ;;
    --repo)
      REPO_URL="$2"
      shift 2
      ;;
    --branch)
      BRANCH="$2"
      shift 2
      ;;
    --api-domain)
      API_DOMAIN="$2"
      shift 2
      ;;
    --admin-domain)
      ADMIN_DOMAIN="$2"
      shift 2
      ;;
    --mobile-domain)
      MOBILE_DOMAIN="$2"
      shift 2
      ;;
    --jwt-secret)
      JWT_SECRET="$2"
      shift 2
      ;;
    --api-port)
      API_PORT="$2"
      shift 2
      ;;
    --bt-nginx-dir)
      BT_NGINX_DIR="$2"
      shift 2
      ;;
    --help)
      print_help
      exit 0
      ;;
    *)
      echo "未知参数: $1"
      print_help
      exit 1
      ;;
  esac
done

if [[ -z "$API_DOMAIN" || -z "$ADMIN_DOMAIN" || -z "$MOBILE_DOMAIN" || -z "$JWT_SECRET" ]]; then
  echo "缺少必要参数。必须提供 --api-domain --admin-domain --mobile-domain --jwt-secret"
  print_help
  exit 1
fi

if [[ ! -d "$BT_NGINX_DIR" ]]; then
  echo "未找到宝塔 Nginx 配置目录: $BT_NGINX_DIR"
  exit 1
fi

if ! command -v git >/dev/null 2>&1; then
  echo "未检测到 git，请先在服务器安装 git"
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "未检测到 node，请先安装 Node.js"
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "未检测到 npm，请先安装 npm"
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "正在安装 pnpm"
  npm install -g pnpm
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "正在安装 pm2"
  npm install -g pm2
fi

mkdir -p /www/wwwroot

if [[ ! -d "$PROJECT_DIR/.git" ]]; then
  echo "== clone =="
  git clone "$REPO_URL" "$PROJECT_DIR"
fi

echo "== update code =="
cd "$PROJECT_DIR"
git fetch origin
git reset --hard "origin/$BRANCH"

echo "== install dependencies =="
pnpm install

echo "== build workspace =="
pnpm build

echo "== write api env =="
cat > "$PROJECT_DIR/apps/api/.env.production" <<EOF
PORT=$API_PORT
HOST=0.0.0.0
NODE_ENV=production
JWT_SECRET=$JWT_SECRET
EOF

echo "== write pm2 config =="
cat > "$PROJECT_DIR/deploy/pm2/ecosystem.config.generated.cjs" <<EOF
module.exports = {
  apps: [
    {
      name: "yingzi-api",
      cwd: "$PROJECT_DIR/apps/api",
      script: "dist/index.js",
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: $API_PORT,
        JWT_SECRET: "$JWT_SECRET"
      }
    }
  ]
};
EOF

echo "== start api with pm2 =="
pm2 delete yingzi-api >/dev/null 2>&1 || true
pm2 start "$PROJECT_DIR/deploy/pm2/ecosystem.config.generated.cjs"
pm2 save

echo "== write nginx config for api domain =="
cat > "$BT_NGINX_DIR/$API_DOMAIN.conf" <<EOF
server {
    listen 80;
    server_name $API_DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:$API_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

echo "== write nginx config for admin domain =="
cat > "$BT_NGINX_DIR/$ADMIN_DOMAIN.conf" <<EOF
server {
    listen 80;
    server_name $ADMIN_DOMAIN;
    root $PROJECT_DIR/apps/admin-web/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:$API_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

echo "== write nginx config for mobile domain =="
cat > "$BT_NGINX_DIR/$MOBILE_DOMAIN.conf" <<EOF
server {
    listen 80;
    server_name $MOBILE_DOMAIN;
    root $PROJECT_DIR/apps/mobile-h5/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:$API_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

echo "== test nginx =="
nginx -t

echo "== reload nginx =="
nginx -s reload

echo "== deploy success =="
echo "API:    http://$API_DOMAIN"
echo "ADMIN:  http://$ADMIN_DOMAIN"
echo "MOBILE: http://$MOBILE_DOMAIN"
echo
echo "下一步建议:"
echo "1. 在宝塔中为这 3 个域名申请 SSL"
echo "2. 开启强制 HTTPS"
echo "3. 后续更新时再次执行本脚本即可自动拉取、构建并重启服务"
