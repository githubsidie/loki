#!/bin/bash

# 任务管理系统 - 项目备份脚本
# 此脚本将帮助您备份整个项目代码到指定位置

echo "========================================"
echo "✅ 任务管理系统 - 项目备份脚本"
echo "========================================"

# 项目根目录
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="$(basename "$PROJECT_DIR")"

# 生成时间戳
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# 默认备份目录（桌面）
DEFAULT_BACKUP_DIR="$(cd ~/Desktop && pwd)"

# 使用默认备份位置，不等待用户输入
BACKUP_DIR="$DEFAULT_BACKUP_DIR"

# 创建备份文件名
BACKUP_FILENAME="${PROJECT_NAME}_backup_${TIMESTAMP}.tar.gz"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILENAME}"

# 显示备份信息
echo "========================================"
echo "备份信息："
echo "- 项目目录: $PROJECT_DIR"
echo "- 备份文件: $BACKUP_PATH"
echo "========================================"
echo "自动开始备份..."

# 开始备份
echo "正在创建备份..."

# 创建备份目录（如果不存在）
mkdir -p "$BACKUP_DIR"

# 使用简单的tar命令备份所有文件
cd "$PROJECT_DIR" && \
tar -czf "$BACKUP_PATH" * .gitignore .git

# 检查备份是否成功
if [ $? -eq 0 ]; then
    # 获取备份文件大小
    BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
    
    echo "========================================"
    echo "✅ 备份成功！"
    echo "========================================"
    echo "备份文件：$BACKUP_PATH"
    echo "备份大小：$BACKUP_SIZE"
    echo "备份时间：$(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    echo "📋 备份内容包括："
    echo "- HTML页面文件（登录、注册、主页等）"
    echo "- JavaScript功能文件（数据管理、认证等）"
    echo "- 样式文件和配置文件"
    echo "- 部署脚本和工具"
    echo ""
    echo "💡 恢复提示："
    echo "要恢复备份，请使用以下命令："
    echo "tar -xzf $BACKUP_PATH -C $(dirname "$PROJECT_DIR")"
    echo ""
    echo "要部署到GitHub，请运行："
    echo "cd $PROJECT_DIR && ./deploy-to-github.sh"
else
    echo "❌ 备份失败，请检查错误信息"
    exit 1
fi

# 显示文件列表
echo "========================================"
echo "📁 项目文件已安全保存，关键文件包括："
echo "========================================"
ls -la "$PROJECT_DIR" | grep -E '\.(html|js|css|sh|md)$' | head -n 10
echo "... 更多文件已备份"
echo "========================================"