# 天官赐福 - 部署指南

## 🚀 解决 Vue Router 404 问题

### 问题原因
当用户直接访问 Vue Router 路由（如 `/fishing-liuyao`、`/bazi` 等）时，nginx 会尝试寻找对应的文件，但这些路由应该由前端 Vue Router 处理，导致 404 错误。

### 解决方案

#### 1. 构建生产版本
```bash
# 进入项目目录
cd /path/to/tianguan-cifu

# 安装依赖（如果还没有）
npm install

# 构建生产版本
npm run build
```

#### 2. 配置 Nginx

**方法一：修改现有配置文件**

编辑您的 nginx 配置文件（通常在 `/etc/nginx/sites-available/default` 或 `/etc/nginx/nginx.conf`）：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 修改为您的域名
    
    # 指向构建后的 dist 目录
    root /path/to/tianguan-cifu/dist;
    index index.html;

    # 🔑 关键配置：处理 Vue Router 路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源优化
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public";
    }
}
```

**方法二：创建新的站点配置**

```bash
# 创建新的配置文件
sudo nano /etc/nginx/sites-available/tianguan-cifu

# 复制上面的配置内容，保存后执行：
sudo ln -s /etc/nginx/sites-available/tianguan-cifu /etc/nginx/sites-enabled/
```

#### 3. 重启 Nginx

```bash
# 测试配置文件语法
sudo nginx -t

# 重新加载配置
sudo nginx -s reload

# 或者重启 nginx 服务
sudo systemctl restart nginx
```

### 📁 目录结构示例

```
/var/www/html/tianguan-cifu/
├── dist/                 # 构建输出目录
│   ├── index.html       # 主页面
│   ├── assets/          # 静态资源
│   ├── qrcode.png       # 微信二维码
│   └── pay.jpg          # 收款二维码
└── ...
```

### 🔧 常见问题排查

#### 1. 检查文件权限
```bash
# 确保 nginx 用户有读取权限
sudo chown -R www-data:www-data /path/to/your/dist
sudo chmod -R 755 /path/to/your/dist
```

#### 2. 检查 nginx 错误日志
```bash
sudo tail -f /var/log/nginx/error.log
```

#### 3. 检查访问日志
```bash
sudo tail -f /var/log/nginx/access.log
```

#### 4. 测试路由是否正常
访问以下地址确认：
- `http://your-domain.com/` （首页）
- `http://your-domain.com/bazi` （八字福运）
- `http://your-domain.com/fishing-liuyao` （六爻钓鱼）
- `http://your-domain.com/calendar` （福运万年历）

### 🌟 优化建议

#### 1. 启用 GZIP 压缩
```nginx
gzip on;
gzip_types text/plain text/css application/javascript application/json;
```

#### 2. 添加安全头部
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
```

#### 3. 配置 HTTPS（推荐）
```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/private.key;
    
    # ... 其他配置
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### 📝 配置文件模板

您可以直接使用项目根目录的以下配置文件：
- `nginx.conf` - 完整版配置
- `nginx-simple.conf` - 简化版配置

根据您的需求选择合适的配置文件。

### ⚡ 快速解决步骤

1. **构建项目**: `npm run build`
2. **复制文件**: 将 `dist/` 目录内容复制到服务器
3. **修改 nginx 配置**: 添加 `try_files $uri $uri/ /index.html;`
4. **重启 nginx**: `sudo nginx -s reload`
5. **测试访问**: 直接访问路由地址确认正常

完成这些步骤后，您的"天官赐福"网站就可以正常处理所有 Vue Router 路由了！ 