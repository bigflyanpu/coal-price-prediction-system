#!/usr/bin/env python3
"""
更新前端API地址脚本
在部署到PythonAnywhere后，运行此脚本更新JavaScript文件中的API地址
"""

import os
import re
import sys

def update_api_address(pythonanywhere_username):
    """
    更新前端JavaScript文件中的API地址
    """
    # 新的API地址
    new_api_url = f"https://{pythonanywhere_username}.pythonanywhere.com/api"
    
    # 需要更新的文件
    frontend_files = [
        "frontend/app_api_integration.js",
        "frontend/app_api_integration_enhanced.js"
    ]
    
    print(f"🎯 开始更新API地址")
    print(f"📡 新API地址: {new_api_url}")
    print()
    
    updated_files = []
    
    for file_path in frontend_files:
        if not os.path.exists(file_path):
            print(f"⚠️  文件不存在: {file_path}")
            continue
            
        print(f"📄 处理文件: {file_path}")
        
        try:
            # 读取文件内容
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 查找并替换API地址
            # 匹配: const API_BASE_URL = 'http://localhost:5002/api';
            pattern = r"const API_BASE_URL\s*=\s*['\"]([^'\"]+)['\"];"
            
            matches = re.findall(pattern, content)
            if matches:
                old_url = matches[0]
                print(f"  找到API地址: {old_url}")
                
                # 替换为新的API地址
                new_content = re.sub(pattern, f'const API_BASE_URL = "{new_api_url}";', content)
                
                # 写回文件
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                
                updated_files.append(file_path)
                print(f"  ✅ 已更新为: {new_api_url}")
            else:
                print(f"  ⚠️  未找到API地址定义")
                # 尝试其他可能的格式
                patterns = [
                    r"API_BASE_URL\s*:\s*['\"]([^'\"]+)['\"]",
                    r"apiBaseUrl\s*=\s*['\"]([^'\"]+)['\"]",
                    r"baseUrl\s*=\s*['\"]([^'\"]+)['\"]"
                ]
                
                for pattern in patterns:
                    matches = re.findall(pattern, content)
                    if matches:
                        old_url = matches[0]
                        print(f"  找到API地址 (格式: {pattern}): {old_url}")
                        break
                
        except Exception as e:
            print(f"  ❌ 处理文件时出错: {e}")
    
    print()
    print("="*60)
    print("📋 更新总结")
    print("="*60)
    
    if updated_files:
        print(f"✅ 成功更新 {len(updated_files)} 个文件:")
        for file in updated_files:
            print(f"  - {file}")
        
        print()
        print("🚀 下一步操作:")
        print("1. 提交更改到GitHub:")
        print(f"   cd /Users/spike/coal_price_prediction/coal_price_prediction_web")
        print(f"   git add {' '.join(updated_files)}")
        print(f"   git commit -m '更新API地址到PythonAnywhere'")
        print(f"   git push origin main")
        print()
        print("2. 等待GitHub Pages更新 (约2分钟)")
        print()
        print("3. 访问网站测试:")
        print(f"   https://bigflyanpu.github.io/coal-price-prediction-system/")
        print()
        print("4. 测试API连接:")
        print(f"   {new_api_url}/status")
        
    else:
        print("⚠️  未更新任何文件")
        print()
        print("💡 手动更新建议:")
        print("1. 打开以下文件:")
        for file_path in frontend_files:
            print(f"   - {file_path}")
        print()
        print("2. 找到以下行:")
        print("   const API_BASE_URL = 'http://localhost:5002/api';")
        print()
        print("3. 替换为:")
        print(f"   const API_BASE_URL = '{new_api_url}';")
    
    return len(updated_files) > 0

def main():
    """主函数"""
    print("🔄 双轨制系统API地址更新工具")
    print("="*60)
    
    if len(sys.argv) > 1:
        username = sys.argv[1]
    else:
        print("请输入你的PythonAnywhere用户名")
        print("例如: python update_api_address.py yourusername")
        print()
        
        # 尝试从环境变量获取
        import getpass
        current_user = getpass.getuser()
        suggestion = f"coalpriceapi"  # 默认建议用户名
        
        username = input(f"PythonAnywhere用户名 [{suggestion}]: ").strip()
        if not username:
            username = suggestion
    
    print()
    print(f"👤 用户名: {username}")
    print()
    
    # 确认信息
    confirm = input(f"确认将API地址更新为 https://{username}.pythonanywhere.com/api? (y/N): ").strip().lower()
    
    if confirm not in ['y', 'yes', '是']:
        print("❌ 操作已取消")
        return False
    
    print()
    success = update_api_address(username)
    
    if success:
        print()
        print("🎉 API地址更新完成！")
    else:
        print()
        print("⚠️  API地址更新可能未完成，请参考上面的建议手动更新")
    
    return success

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n❌ 操作被用户取消")
        sys.exit(1)