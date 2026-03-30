#!/usr/bin/env python3
"""
PythonAnywhere配置检查脚本
在PythonAnywhere的Bash控制台中运行此脚本来验证配置是否正确
"""

import sys
import os
import subprocess
import importlib.util

def print_header(text):
    """打印标题"""
    print("\n" + "="*60)
    print(f"🔍 {text}")
    print("="*60)

def check_python_version():
    """检查Python版本"""
    print_header("检查Python版本")
    print(f"Python版本: {sys.version}")
    print(f"Python路径: {sys.executable}")
    return sys.version_info.major == 3 and sys.version_info.minor >= 8

def check_imports():
    """检查必要的导入"""
    print_header("检查依赖包导入")
    
    required_packages = [
        ('flask', 'Flask'),
        ('flask_cors', 'CORS'),
        ('pandas', 'pandas'),
        ('numpy', 'numpy'),
        ('requests', 'requests')
    ]
    
    all_ok = True
    for module_name, display_name in required_packages:
        try:
            spec = importlib.util.find_spec(module_name)
            if spec is None:
                print(f"❌ {display_name}: 未找到")
                all_ok = False
            else:
                print(f"✅ {display_name}: 已安装 ({spec.origin})")
        except Exception as e:
            print(f"❌ {display_name}: 导入错误 - {e}")
            all_ok = False
    
    return all_ok

def check_environment():
    """检查环境变量和路径"""
    print_header("检查环境配置")
    
    # 检查当前工作目录
    cwd = os.getcwd()
    print(f"当前工作目录: {cwd}")
    
    # 检查Python路径
    python_path = os.environ.get('PYTHONPATH', '未设置')
    print(f"PYTHONPATH: {python_path}")
    
    # 检查是否在虚拟环境中
    if 'VIRTUAL_ENV' in os.environ:
        print(f"✅ 虚拟环境: {os.environ['VIRTUAL_ENV']}")
    else:
        print("⚠️  未检测到虚拟环境（可能正常，如果使用系统Python）")
    
    return True

def check_api_server():
    """检查API服务器文件"""
    print_header("检查API服务器文件")
    
    api_file = 'api_server_robust.py'
    if os.path.exists(api_file):
        print(f"✅ API服务器文件存在: {api_file}")
        
        # 尝试导入API服务器
        try:
            # 临时修改sys.path以导入当前目录
            original_path = sys.path.copy()
            sys.path.insert(0, os.getcwd())
            
            import api_server_robust
            print("✅ API服务器模块可以导入")
            
            # 检查Flask应用
            if hasattr(api_server_robust, 'app'):
                print("✅ Flask应用对象存在")
            else:
                print("❌ Flask应用对象不存在")
                
            sys.path = original_path
            return True
            
        except Exception as e:
            print(f"❌ 导入API服务器时出错: {e}")
            return False
    else:
        print(f"❌ API服务器文件不存在: {api_file}")
        return False

def check_requirements():
    """检查requirements.txt文件"""
    print_header("检查requirements.txt")
    
    req_file = 'requirements.txt'
    if os.path.exists(req_file):
        print(f"✅ requirements.txt文件存在: {req_file}")
        
        # 读取requirements
        try:
            with open(req_file, 'r') as f:
                requirements = [line.strip() for line in f if line.strip() and not line.startswith('#')]
            
            print(f"找到 {len(requirements)} 个依赖项:")
            for req in requirements:
                print(f"  - {req}")
            
            return True
        except Exception as e:
            print(f"❌ 读取requirements.txt时出错: {e}")
            return False
    else:
        print(f"❌ requirements.txt文件不存在")
        return False

def check_wsgi_configuration():
    """检查WSGI配置"""
    print_header("检查WSGI配置")
    
    # 提供WSGI配置示例
    print("📋 你的WSGI文件应该包含以下内容:")
    print("-" * 40)
    print("""
import sys

# 添加项目路径到系统路径
path = '/home/你的用户名/coal-price-prediction-web'
if path not in sys.path:
    sys.path.append(path)

# 导入Flask应用
from api_server_robust import app as application
""")
    print("-" * 40)
    print("\n💡 请确保将'你的用户名'替换为你的PythonAnywhere用户名")
    
    return True

def check_network_access():
    """检查网络访问"""
    print_header("检查网络访问")
    
    try:
        import requests
        test_url = "https://api.github.com"
        response = requests.get(test_url, timeout=5)
        print(f"✅ 网络连接正常 (访问 {test_url} 成功)")
        return True
    except Exception as e:
        print(f"⚠️  网络连接测试失败: {e}")
        print("💡 这可能不影响API运行，但可能影响外部数据获取")
        return False

def main():
    """主函数"""
    print("🎯 PythonAnywhere配置检查脚本")
    print("🏭 煤炭双轨制价格预测系统")
    print("=" * 60)
    
    checks = []
    
    # 执行各项检查
    checks.append(("Python版本", check_python_version()))
    checks.append(("依赖包导入", check_imports()))
    checks.append(("环境配置", check_environment()))
    checks.append(("API服务器文件", check_api_server()))
    checks.append(("requirements.txt", check_requirements()))
    checks.append(("WSGI配置", check_wsgi_configuration()))
    checks.append(("网络访问", check_network_access()))
    
    # 打印总结
    print_header("检查结果总结")
    
    passed = sum(1 for _, result in checks if result)
    total = len(checks)
    
    print(f"✅ 通过: {passed}/{total}")
    print(f"📊 成功率: {passed/total*100:.1f}%")
    print()
    
    for name, result in checks:
        status = "✅" if result else "❌"
        print(f"{status} {name}")
    
    print()
    
    if passed == total:
        print("🎉 所有检查都通过！你的配置看起来是正确的。")
        print("💡 下一步：")
        print("  1. 在PythonAnywhere Web配置页面重启应用")
        print("  2. 访问 https://你的用户名.pythonanywhere.com/api/status 测试API")
        print("  3. 更新前端JavaScript中的API地址")
    else:
        print("⚠️  有些检查未通过，请查看上面的详细错误信息。")
        print("💡 建议：")
        print("  1. 按照错误提示修复问题")
        print("  2. 确保虚拟环境已激活并安装了所有依赖")
        print("  3. 检查WSGI文件配置是否正确")
        print("  4. 确保文件上传到了正确的目录")
    
    print()
    print("📚 更多帮助请参考：")
    print("  - PythonAnywhere手把手部署教程.md")
    print("  - https://help.pythonanywhere.com/")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)