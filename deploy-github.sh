#!/bin/bash

# GitHub Pages 自动部署脚本
# 这个脚本会帮您创建GitHub仓库并部署项目

echo "🚀 GitHub Pages 部署助手"
echo "=========================="

# 检查是否已安装git
if ! command -v git &> /dev/null; then
    echo "❌ 请先安装Git: https://git-scm.com/downloads"
    exit 1
fi

# 检查Git配置
if ! git config --global user.name &> /dev/null; then
    echo "请输入您的GitHub用户名:"
    read git_username
    git config --global user.name "$git_username"
fi

if ! git config --global user.email &> /dev/null; then
    echo "请输入您的GitHub邮箱:"
    read git_email
    git config --global user.email "$git_email"
fi

echo "📋 部署步骤说明："
echo "1. 登录GitHub: https://github.com"
echo "2. 创建新仓库，命名为: your-username.github.io"
echo "3. 不要勾选 'Initialize this repository with a README'"
echo "4. 创建完成后，复制仓库的HTTPS地址"
echo ""
echo "按回车键继续..."
read

# 初始化git仓库
echo "📁 初始化Git仓库..."
cd /Users/daitao/Desktop/测试项目
git init

# 创建.gitignore文件
cat > .gitignore << 'EOF'
.DS_Store
node_modules/
*.log
.env
.vercel
EOF

# 添加所有文件
echo "📂 添加项目文件..."
git add .

# 提交更改
echo "💾 提交更改..."
git commit -m "Initial commit - 任务管理系统"

# 获取仓库地址
echo "🔗 请输入您的GitHub仓库地址（HTTPS格式）:"
echo "格式: https://github.com/your-username/your-username.github.io.git"
read repo_url

# 添加远程仓库
echo "🔗 连接远程仓库..."
git remote add origin "$repo_url"

# 推送到GitHub
echo "📤 推送到GitHub..."
git push -u origin main

echo "✅ 部署完成！"
echo "🌐 您的网站地址: https://your-username.github.io"
echo ""
echo "如果推送失败，请尝试："
echo "1. 检查GitHub仓库地址是否正确"
echo "2. 确保有GitHub账号并已登录"
echo "3. 检查网络连接"
echo "4. 可能需要先在GitHub上创建Personal Access Token"