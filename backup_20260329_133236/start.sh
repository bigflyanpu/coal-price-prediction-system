#!/bin/bash

# 多尺度双轨制煤炭价格智能预测系统启动脚本
echo "==========================================="
echo "  多尺度双轨制煤炭价格智能预测系统"
echo "  基于南京大学创新训练项目"
echo "==========================================="
echo ""
echo "请选择启动方式："
echo "1. 仅前端运行（打开HTML文件）"
echo "2. 完整前后端运行（需要Node.js环境）"
echo "3. 退出"
echo ""
read -p "请输入选择 (1-3): " choice

case $choice in
    1)
        echo "正在打开前端页面..."
        # 尝试在不同系统中打开HTML文件
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            open frontend/index.html
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            xdg-open frontend/index.html 2>/dev/null || echo "请手动打开 frontend/index.html"
        elif [[ "$OSTYPE" == "msys"* ]] || [[ "$OSTYPE" == "win32"* ]]; then
            # Windows
            start frontend/index.html
        else
            echo "无法自动打开，请手动在浏览器中打开：frontend/index.html"
        fi
        echo "前端页面已打开，使用模拟数据运行"
        ;;
    2)
        echo "检查Node.js环境..."
        if ! command -v node &> /dev/null; then
            echo "❌ 未安装Node.js，请先安装Node.js"
            echo "访问 https://nodejs.org/ 下载安装"
            exit 1
        fi
        
        if ! command -v npm &> /dev/null; then
            echo "❌ 未安装npm，请先安装Node.js"
            exit 1
        fi
        
        echo "✅ Node.js版本: $(node --version)"
        echo "✅ npm版本: $(npm --version)"
        
        echo "安装依赖..."
        npm install
        
        echo "启动后端服务器..."
        echo "服务器将在 http://localhost:3000 启动"
        echo "按 Ctrl+C 停止服务器"
        echo ""
        npm start
        ;;
    3)
        echo "退出系统"
        exit 0
        ;;
    *)
        echo "无效选择"
        exit 1
        ;;
esac