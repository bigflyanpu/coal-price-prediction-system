#!/bin/bash

# 修复GitHub Pages部署脚本
echo "==========================================="
echo "修复GitHub Pages部署 - 煤炭价格预测系统"
echo "==========================================="
echo ""

# 备份原始文件
echo "备份原始文件..."
cp -r frontend backup_deploy_original/

# 创建根目录部署版本
echo "创建根目录部署版本..."
rm -rf deploy_to_root
mkdir -p deploy_to_root

# 复制前端文件到根目录
cp frontend/index.html deploy_to_root/
cp frontend/app.js deploy_to_root/
cp frontend/.nojekyll deploy_to_root/

# 创建简单的部署README
cat > deploy_to_root/README.md << 'EOF'
# 多尺度双轨制煤炭价格智能预测系统

这是一个简化的GitHub Pages部署版本。

访问网站: https://bigflyanpu.github.io/coal-price-prediction-system/

## 部署步骤

1. 上传本文件夹到GitHub仓库根目录
2. 在仓库设置中启用GitHub Pages
3. 选择 "Deploy from a branch" → "main" → "/ (root)"
4. 保存设置，等待1-2分钟

## 功能
- 多尺度煤炭价格预测
- 双轨制定价系统展示
- 交互式数据可视化
- 南京大学创新训练项目展示
EOF

echo "✅ 修复完成！"
echo ""
echo "请执行以下步骤："
echo "1. 访问GitHub仓库: https://github.com/bigflyanpu/coal-price-prediction-system"
echo "2. 删除现有所有文件"
echo "3. 上传 'deploy_to_root' 文件夹中的所有文件到仓库根目录"
echo "4. 进入 Settings → Pages"
echo "5. 配置: Source: Deploy from a branch, Branch: main, Folder: / (root)"
echo "6. 点击 Save"
echo "7. 等待1-2分钟，访问: https://bigflyanpu.github.io/coal-price-prediction-system/"
echo ""
echo "或者运行以下命令自动部署："
echo "cd /Users/spike/object_C++/coal_price_prediction_web"
echo "./auto_deploy_to_root.sh"