#!/bin/bash

# GitHub Pages部署脚本
# 请按顺序执行以下命令

echo "==========================================="
echo "GitHub Pages部署脚本 - 煤炭价格预测系统"
echo "==========================================="
echo ""
echo "请确保："
echo "1. 已注册GitHub账号"
echo "2. 已创建仓库：coal-price-prediction-system"
echo "3. 替换下面命令中的 YOUR-USERNAME 为您的GitHub用户名"
echo ""
echo "按回车键开始..."
read

# 步骤1: 初始化Git仓库
echo "步骤1: 初始化Git仓库..."
cd /Users/spike/object_C++/coal_price_prediction_web
git init

# 步骤2: 添加文件
echo "步骤2: 添加前端文件..."
git add frontend/

# 步骤3: 提交更改
echo "步骤3: 提交更改..."
git commit -m "部署煤炭价格预测系统前端"

# 步骤4: 连接到GitHub仓库
echo "步骤4: 连接到GitHub仓库..."
echo "请输入您的GitHub用户名: "
read username
git remote add origin https://github.com/$username/coal-price-prediction-system.git

# 步骤5: 推送到GitHub
echo "步骤5: 推送到GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ 文件已上传到GitHub！"
echo ""
echo "接下来请："
echo "1. 访问 https://github.com/$username/coal-price-prediction-system"
echo "2. 点击 Settings → Pages"
echo "3. 在 Build and deployment 部分："
echo "   - Source: 选择 Deploy from a branch"
echo "   - Branch: 选择 main，文件夹选择 /frontend"
echo "4. 点击 Save"
echo ""
echo "等待1-2分钟后，您的网站将在以下地址发布："
echo "https://$username.github.io/coal-price-prediction-system/"
echo ""
echo "现在按回车键打开GitHub仓库页面..."
read
open "https://github.com/$username/coal-price-prediction-system"

echo "✅ 部署脚本完成！请按上述步骤配置GitHub Pages。"