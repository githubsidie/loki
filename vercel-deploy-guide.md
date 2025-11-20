# Vercel 部署指南

## 步骤一：准备项目

1. 确保项目结构正确：
   - index.html (主页面)
   - styles.css (样式文件)
   - 未命名.js (JavaScript文件)
   - tasks.json (数据文件)

2. 在项目根目录创建 `vercel.json` 配置文件

## 步骤二：创建 vercel.json 配置

```json
{
  "version": 2,
  "public": true,
  "github": {
    "enabled": false
  },
  "functions": {},
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, must-revalidate"
        }
      ]
    }
  ]
}
```

## 步骤三：Vercel CLI 部署

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 部署项目
vercel --prod

# 按照提示操作：
# 1. 选择项目目录
# 2. 确认配置
# 3. 等待部署完成
```

## 步骤四：访问应用

部署完成后，Vercel会提供：
- 生产环境URL（如：https://your-project.vercel.app）
- 自动HTTPS支持
- 全球CDN加速

## 优势

✅ 免费托管
✅ 自动HTTPS
✅ 全球CDN
✅ 自动部署
✅ 自定义域名支持

## 注意事项

- 免费版有带宽限制（100GB/月）
- 适合个人和小型项目
- 支持自定义域名