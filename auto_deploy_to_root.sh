#!/bin/bash

echo "🚀 自动部署煤炭价格预测系统到GitHub Pages根目录"
echo "==========================================="

# 备份当前状态
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
echo "创建备份: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"
cp -r ./* "$BACKUP_DIR/" 2>/dev/null || true

# 创建临时目录用于新部署
echo "准备根目录部署文件..."
DEPLOY_DIR="deploy_root"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# 复制必要的文件到根目录
echo "复制前端文件到根目录..."
cp frontend/index.html "$DEPLOY_DIR/"
cp frontend/app.js "$DEPLOY_DIR/"
cp frontend/.nojekyll "$DEPLOY_DIR/"

# 创建简化版的README
cat > "$DEPLOY_DIR/README.md" << 'EOF'
# 多尺度双轨制煤炭价格智能预测系统

## 项目简介
本项目是基于中国双轨制定价体系下的煤炭价格预测系统，使用多尺度分析和机器学习技术进行价格预测。

## 功能特点
- 多尺度煤炭价格预测（日度、月度、年度）
- 双轨制定价系统展示（市场价、长协价、基准价）
- 交互式数据可视化图表
- 响应式设计，支持移动端和桌面端

## 访问链接
[访问网站](https://bigflyanpu.github.io/coal-price-prediction-system/)

## 技术栈
- HTML5/CSS3/JavaScript
- Chart.js 数据可视化
- GitHub Pages 部署

## 部署说明
此版本为GitHub Pages优化版本，所有文件位于仓库根目录。
EOF

# 检查Git状态
echo "检查Git仓库状态..."
if [ ! -d ".git" ]; then
    echo "初始化Git仓库..."
    git init
fi

# 重新初始化Git仓库
echo "重新初始化Git仓库用于根目录部署..."
rm -rf .git
git init
git remote add origin https://github.com/bigflyanpu/coal-price-prediction-system.git 2>/dev/null || git remote set-url origin https://github.com/bigflyanpu/coal-price-prediction-system.git

# 切换到deploy目录进行提交
cd "$DEPLOY_DIR"

echo "添加文件到Git..."
git add .
git commit -m "部署煤炭价格预测系统到GitHub Pages根目录"

echo "推送到GitHub仓库..."
git push -f origin main

cd ..

echo ""
echo "✅ 部署完成！"
echo ""
echo "接下来请手动完成以下步骤："
echo "1. 访问 https://github.com/bigflyanpu/coal-price-prediction-system"
echo "2. 进入 Settings → Pages"
echo "3. 配置: Source: Deploy from a branch, Branch: main, Folder: / (root)"
echo "4. 点击 Save"
echo "5. 等待1-2分钟"
echo "6. 访问: https://bigflyanpu.github.io/coal-price-prediction-system/"
echo ""
echo "您也可以运行以下命令检查部署状态："
echo "curl -s -o /dev/null -w \"%{http_code}\" https://bigflyanpu.github.io/coal-price-prediction-system/"
echo ""
echo "如果返回200，表示部署成功！"