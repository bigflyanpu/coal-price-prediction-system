# PythonAnywhere 手把手部署教程
## 煤炭双轨制价格预测系统API服务器部署

> **特别说明**：这是为初学者设计的最详细教程，每一步都有明确说明和截图位置提示。

---

## 📋 部署前准备

### 1. 需要准备的文件（都已经在你的电脑上）
```
✅ api_server_robust.py          # 主要API服务器文件
✅ requirements.txt              # Python依赖包列表
✅ frontend/ 目录（包含JavaScript文件）
```

### 2. 需要的账户
- **GitHub账户**（已经注册，bigflyanpu）
- **PythonAnywhere免费账户**（马上注册）

---

## 🚀 第一步：注册PythonAnywhere账户

### 具体步骤：
1. **打开浏览器**：访问 https://www.pythonanywhere.com
2. **点击注册**：在首页找到 "Pricing & signup" → "Create a Beginner account"
3. **填写信息**：
   - Username: 选择用户名（如 `coalpriceapi`）
   - Email: 你的邮箱
   - Password: 设置密码
4. **确认邮箱**：检查邮箱，点击确认链接

**预计时间**：5分钟

---

## 🖥️ 第二步：登录PythonAnywhere

### 截图位置参考：
![登录页面](https://www.pythonanywhere.com/static/images/pa_login_screen.png)

### 具体步骤：
1. 访问 https://www.pythonanywhere.com
2. 点击右上角 "Log in"
3. 输入用户名和密码
4. 点击 "Log in"

**成功标志**：看到控制面板，顶部显示你的用户名

---

## 📁 第三步：上传文件到PythonAnywhere

### 需要上传的文件：
1. `api_server_robust.py`
2. `requirements.txt`
3. `frontend/` 文件夹中的文件（可选，用于参考）

### 具体步骤：

#### 3.1 进入文件管理器
**位置**：控制面板 → 点击 "Files" 标签

#### 3.2 创建项目文件夹
1. 点击 "Enter new directory name" 输入框
2. 输入：`coal-price-prediction-web`
3. 点击 "Create directory"
4. 进入新创建的文件夹

#### 3.3 上传 `api_server_robust.py`
1. 点击 "Upload a file" 按钮
2. 点击 "Choose File" 按钮
3. **在你的电脑上找到文件**：
   ```
   /Users/spike/coal_price_prediction/coal_price_prediction_web/api_server_robust.py
   ```
4. 点击 "Open"
5. 点击 "Upload"

#### 3.4 上传 `requirements.txt`
1. 再次点击 "Upload a file"
2. 选择文件：
   ```
   /Users/spike/coal_price_prediction/coal_price_prediction_web/requirements.txt
   ```
3. 上传

**验证**：在文件列表中应该能看到这两个文件

---

## 🐍 第四步：创建Python虚拟环境

### 为什么需要虚拟环境？
- 隔离项目依赖
- 避免与其他项目冲突
- 保证依赖版本一致性

### 具体步骤：

#### 4.1 打开Bash控制台
**位置**：控制面板 → 点击 "Consoles" 标签 → 点击 "Bash"

#### 4.2 进入项目目录
在Bash控制台中输入：
```bash
cd coal-price-prediction-web
pwd  # 查看当前目录，应该显示 /home/你的用户名/coal-price-prediction-web
```

#### 4.3 创建虚拟环境
```bash
# 创建名为 coal-api 的虚拟环境
mkvirtualenv coal-api --python=/usr/bin/python3.8
```

**执行结果**：应该看到类似提示：
```
Running virtualenv with interpreter /usr/bin/python3.8
New python executable in /home/你的用户名/.virtualenvs/coal-api/bin/python3.8
Installing setuptools, pip, wheel...done.
virtualenvwrapper.user_scripts creating /home/你的用户名/.virtualenvs/coal-api/bin/predeactivate
virtualenvwrapper.user_scripts creating /home/你的用户名/.virtualenvs/coal-api/bin/postdeactivate
virtualenvwrapper.user_scripts creating /home/你的用户名/.virtualenvs/coal-api/bin/preactivate
virtualenvwrapper.user_scripts creating /home/你的用户名/.virtualenvs/coal-api/bin/postactivate
virtualenvwrapper.user_scripts creating /home/你的用户名/.virtualenvs/coal-api/bin/get_env_details
```

#### 4.4 激活虚拟环境并安装依赖
```bash
# 如果不在虚拟环境中，先激活
workon coal-api

# 安装依赖包
pip install -r requirements.txt
```

**执行结果**：应该看到类似提示：
```
Collecting Flask>=2.3.0
  Downloading Flask-2.3.0-py3-none-any.whl (96 kB)
Collecting Flask-CORS>=4.0.0
  Downloading Flask_CORS-4.0.0-py2.py3-none-any.whl (14 kB)
Collecting pandas>=2.0.0
  Downloading pandas-2.0.0-cp38-cp38-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (12.3 MB)
...
Successfully installed Flask-2.3.0 Flask-CORS-4.0.0 numpy-1.24.0 pandas-2.0.0 requests-2.31.0
```

#### 4.5 验证安装
```bash
# 检查Flask是否安装成功
python -c "import flask; print('Flask version:', flask.__version__)"
python -c "import pandas; print('Pandas version:', pandas.__version__)"
```

**预期输出**：
```
Flask version: 2.3.0
Pandas version: 2.0.0
```

---

## 🌐 第五步：创建Web应用

### 具体步骤：

#### 5.1 进入Web应用配置
**位置**：控制面板 → 点击 "Web" 标签

#### 5.2 创建新Web应用
1. 点击 "Add a new web app" 按钮
2. 如果是第一次创建，点击 "Next"
3. 选择 "Manual configuration"（手动配置）
4. 选择 "Python 3.8"
5. 点击 "Next"

#### 5.3 配置WSGI文件
1. 在Web应用配置页面，找到 "WSGI configuration file:" 链接
2. 点击该链接（会打开一个文本编辑器）

#### 5.4 编辑WSGI文件
**删除原有内容**，替换为以下代码：
```python
import sys

# 添加项目路径到系统路径
path = '/home/你的用户名/coal-price-prediction-web'
if path not in sys.path:
    sys.path.append(path)

# 设置环境变量（如果需要）
import os
os.environ['PYTHONPATH'] = path

# 导入Flask应用
from api_server_robust import app as application
```

**重要**：将 `你的用户名` 替换为你的PythonAnywhere用户名

#### 5.5 保存WSGI文件
1. 点击编辑器顶部的 "Save" 按钮
2. 关闭编辑器标签页

---

## ⚙️ 第六步：配置虚拟环境和静态文件

### 6.1 配置虚拟环境路径
**位置**：回到Web应用配置页面

1. 找到 "Virtualenv" 部分
2. 在输入框中填写：
   ```
   /home/你的用户名/.virtualenvs/coal-api
   ```
3. 点击输入框外的任意地方保存

### 6.2 配置静态文件（可选）
如果需要直接从PythonAnywhere提供静态文件，可以配置：

1. 找到 "Static files" 部分
2. 点击 "Enter URL"：`/static`
3. 点击 "Enter path"：`/home/你的用户名/coal-price-prediction-web`
4. 点击 "Add" 按钮

**注意**：我们的API主要是JSON数据，静态文件在GitHub Pages上，这一步可以跳过。

---

## 🔄 第七步：重启Web应用

### 具体步骤：
1. 在Web应用配置页面顶部
2. 找到绿色的 "Reload 你的用户名.pythonanywhere.com" 按钮
3. 点击该按钮

**等待几秒钟**：应用会重新启动

### 7.1 检查应用状态
1. 查看页面顶部的状态消息
2. 应该显示 "Reloading..." 然后变成 "Everything looks good!"

---

## ✅ 第八步：测试API

### 8.1 获取你的API地址
在Web应用配置页面顶部，找到：
```
Your web app is now live at: https://你的用户名.pythonanywhere.com
```

### 8.2 测试API状态端点
在浏览器中访问：
```
https://你的用户名.pythonanywhere.com/api/status
```

**预期结果**：看到JSON数据：
```json
{
  "status": "online",
  "system_available": false,
  "system_initialized": true,
  "timestamp": "2026-03-30T03:35:00.123456",
  "version": "1.0.0",
  "description": "中国煤炭双轨制定价价格预测系统API（稳健版）",
  "mode": "simulation",
  "note": "使用模拟数据模式，避免网络请求导致的卡死问题"
}
```

### 8.3 测试双轨制分析API
在浏览器中访问：
```
https://你的用户名.pythonanywhere.com/api/dual-track/quick
```

**预期结果**：看到价格预测数据：
```json
{
  "success": true,
  "timestamp": "2026-03-30T03:35:10.123456",
  "market_price": 826.0,
  "planned_price": 764.86,
  "price_difference": 61.14,
  "price_difference_pct": 8.0,
  "recommendation": "观望",
  "confidence": 0.6,
  "risk_level": "中等",
  "futures_trend": "up",
  "composite_score": 0.5,
  "mode": "simulation",
  "performance": "immediate"
}
```

---

## 🔧 第九步：配置前端网站连接API

### 9.1 修改前端API地址
需要修改GitHub Pages网站中的API地址：

**文件位置**：在你的电脑上
```
/Users/spike/coal_price_prediction/coal_price_prediction_web/frontend/app_api_integration.js
/Users/spike/coal_price_prediction/coal_price_prediction_web/frontend/app_api_integration_enhanced.js
```

**修改内容**：找到以下行：
```javascript
const API_BASE_URL = 'http://localhost:5002/api';
```
修改为：
```javascript
const API_BASE_URL = 'https://你的用户名.pythonanywhere.com/api';
```

### 9.2 更新GitHub Pages
```bash
# 在你的电脑上执行
cd /Users/spike/coal_price_prediction/coal_price_prediction_web
git add frontend/app_api_integration.js frontend/app_api_integration_enhanced.js
git commit -m "更新API地址到PythonAnywhere"
git push origin main
```

**等待2分钟**：GitHub Pages会自动更新

---

## 🚨 第十步：故障排除

### 问题1：WSGI文件错误
**症状**：Web应用显示 "Internal server error"

**解决方案**：
1. 检查WSGI文件语法
2. 确保路径正确
3. 查看错误日志：
   - Web配置页面 → "Error log" 链接

### 问题2：依赖包安装失败
**症状**：`pip install` 命令失败

**解决方案**：
```bash
# 尝试逐个安装
pip install Flask==2.3.0
pip install Flask-CORS==4.0.0
pip install pandas==2.0.0
pip install numpy==1.24.0
pip install requests==2.31.0
```

### 问题3：虚拟环境未生效
**症状**：应用无法导入模块

**解决方案**：
1. 确保虚拟环境路径正确
2. 重新加载Web应用
3. 检查虚拟环境是否激活：
   ```bash
   # 在Bash控制台中
   which python
   # 应该显示：/home/你的用户名/.virtualenvs/coal-api/bin/python
   ```

### 问题4：端口被占用
**症状**：Web应用无法启动

**解决方案**：
1. PythonAnywhere自动管理端口，一般不会有此问题
2. 联系PythonAnywhere支持

### 问题5：内存不足
**症状**：应用运行缓慢或崩溃

**解决方案**：
1. PythonAnywhere免费账户有512MB内存限制
2. 我们的API很轻量，一般不会超限
3. 如果超限，考虑升级账户或优化代码

---

## 📊 第十一步：验证完整系统

### 验证步骤：
1. **访问GitHub Pages网站**：
   ```
   https://bigflyanpu.github.io/coal-price-prediction-system/
   ```

2. **测试双轨制分析功能**：
   - 在网站界面中点击"执行双轨制分析"
   - 查看是否成功获取数据

3. **检查浏览器控制台**：
   - 按F12打开开发者工具
   - 点击"Network"标签
   - 查看API请求是否成功
   - 状态码应该是200

### 成功标志：
1. ✅ GitHub Pages网站正常显示
2. ✅ PythonAnywhere API返回JSON数据
3. ✅ 网站能成功调用API并显示结果
4. ✅ 双轨制价格分析功能正常工作

---

## 🔄 第十二步：日常维护

### 每日检查（10秒）：
1. 访问你的API状态页面
2. 确认返回"status": "online"

### 每月维护（5分钟）：
1. 登录PythonAnywhere
2. 检查CPU使用情况
3. 查看错误日志

### 依赖更新（需要时）：
```bash
# 在Bash控制台中
workon coal-api
pip install --upgrade -r requirements.txt
# 重启Web应用
```

---

## 📞 技术支持

### 遇到问题怎么办？
1. **查看错误日志**：Web配置页面 → "Error log"
2. **检查API状态**：`/api/status` 端点
3. **PythonAnywhere文档**：https://help.pythonanywhere.com/
4. **项目GitHub Issues**：在仓库中提issue

### 联系信息：
- **PythonAnywhere支持**：support@pythonanywhere.com
- **GitHub仓库**：https://github.com/bigflyanpu/coal-price-prediction-system

---

## 🎉 恭喜！部署完成

### 你现在拥有：
1. ✅ **静态网站**：GitHub Pages（前端界面）
2. ✅ **API服务器**：PythonAnywhere（后端逻辑）
3. ✅ **完整系统**：双轨制煤炭价格预测

### 可以分享的链接：
1. **网站地址**：https://bigflyanpu.github.io/coal-price-prediction-system/
2. **API地址**：https://你的用户名.pythonanywhere.com/api/status

### 最终验证：
访问以下链接，全部显示正常即为成功：
```
1. https://bigflyanpu.github.io/coal-price-prediction-system/
2. https://你的用户名.pythonanywhere.com/api/status
3. https://你的用户名.pythonanywhere.com/api/dual-track/quick
```

---

## ⚠️ 重要提醒

### PythonAnywhere免费账户限制：
1. **CPU时间**：每天100秒（足够小型API使用）
2. **磁盘空间**：512MB（足够我们的项目）
3. **Web应用休眠**：长时间无访问会休眠，下次访问有延迟
4. **自定义域名**：需要付费账户

### 如果需要24/7不间断服务：
考虑升级到：
1. **PythonAnywhere付费计划**：$5/月起
2. **Heroku Hobby计划**：$7/月
3. **DigitalOcean VPS**：$5/月

但对于课程项目和学生使用，**免费计划完全足够**！

---

## 🔗 相关文件

### 在你的电脑上：
1. `/Users/spike/coal_price_prediction/coal_price_prediction_web/api_server_robust.py`
2. `/Users/spike/coal_price_prediction/coal_price_prediction_web/requirements.txt`
3. `/Users/spike/coal_price_prediction/coal_price_prediction_web/PythonAnywhere手把手部署教程.md`（本文件）

### 在PythonAnywhere上：
1. `/home/你的用户名/coal-price-prediction-web/api_server_robust.py`
2. `/home/你的用户名/coal-price-prediction-web/requirements.txt`

---

**祝部署顺利！如果有任何问题，请随时参考本教程的故障排除部分。**