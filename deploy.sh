#!/bin/bash

# 项目部署脚本
# 适用于Ubuntu/Debian系统

echo "🚀 开始部署项目..."

# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Nginx
sudo apt install nginx -y

# 创建项目目录
sudo mkdir -p /var/www/your-project-name
sudo chown -R $USER:$USER /var/www/your-project-name

# 复制项目文件到服务器目录
cp -r /Users/daitao/Desktop/测试项目/* /var/www/your-project-name/

# 配置Nginx
cat > /etc/nginx/sites-available/your-project-name << EOF
server {
    listen 80;
    server_name your-domain.com;  # 替换为您的域名或IP
    
    root /var/www/your-project-name;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ =404;
    }
    
    # 静态资源缓存
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# 启用站点
sudo ln -s /etc/nginx/sites-available/your-project-name /etc/nginx/sites-enabled/

# 测试Nginx配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx

# 设置防火墙
sudo ufw allow 'Nginx Full'

echo "✅ 部署完成！"
echo "🌐 访问地址: http://your-domain.com 或 http://your-server-ip"
echo "📁 项目目录: /var/www/your-project-name"