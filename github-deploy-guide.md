# GitHub Pages 部署指南

## 步骤一：创建GitHub仓库

1. 登录GitHub账号
2. 创建新仓库，命名为 `your-username.github.io`
3. 将项目文件上传到仓库

## 步骤二：上传项目文件

```bash
# 初始化git仓库
git init

# 添加远程仓库
git remote add origin https://github.com/your-username/your-username.github.io.git

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit"

# 推送到GitHub
git push -u origin main
```

## 步骤三：启用GitHub Pages

1. 进入仓库Settings
2. 找到Pages选项
3. 选择Source为main分支
4. 访问地址：https://your-username.github.io

## 注意事项

- GitHub Pages只支持静态网站
- 私有仓库需要付费套餐
- 自定义域名需要Pro套餐