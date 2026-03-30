# 双轨制价格预测系统 - 云端API部署详细指南

## 📌 重要说明：为什么要部署到云端？

**GitHub Pages只能托管静态网站（HTML/CSS/JS），无法运行Python API服务器。**

为了让其他人能够24/7访问你的双轨制价格预测系统，**必须将API服务器部署到云端**。

### 云端部署的好处：
1. **24/7可访问** - API服务器持续运行，用户随时可用
2. **全球访问** - 任何地方的用户都能访问你的系统
3. **无需本地运行** - 用户不需要在自己的电脑上启动Python
4. **专业可靠** - 云平台提供监控、备份和自动恢复

## 🏆 推荐云平台比较

| 平台 | 免费额度 | 部署难度 | 特点 | 适合人群 |
|------|----------|----------|------|----------|
| **Heroku** | 512MB内存，每月550小时 | ⭐⭐ 中等 | 经典的Python部署平台，功能完善 | 有一定经验的开发者 |
| **PythonAnywhere** | 512MB磁盘，每天100秒CPU | ⭐ 简单 | 专门为Python设计，界面友好 | 初学者，学生 |
| **Railway** | 每月5美元额度 | ⭐⭐ 中等 | 现代平台，支持自动部署 | 喜欢现代工具的用户 |
| **Render** | 750免费小时/月 | ⭐⭐ 中等 | 简单易用，自动HTTPS | 小型项目 |
| **Fly.io** | 每月3个共享CPU，3GB内存 | ⭐⭐⭐ 较难 | 全球边缘部署，速度快 | 需要高性能的用户 |

## 🚀 部署方案一：Heroku（推荐）

### 优点：
- 免费层可用（需要信用卡验证）
- 部署过程成熟完善
- 社区支持丰富

### 部署步骤：

#### 1. 准备工作
```bash
# 确保你已安装Heroku CLI
# 如果没有，先安装：https://devcenter.heroku.com/articles/heroku-cli

# 登录Heroku
heroku login

# 进入项目目录
cd /Users/spike/coal_price_prediction/coal_price_prediction_web
```

#### 2. 创建Heroku应用
```bash
# 创建应用（会自动生成唯一名称）
heroku create coal-dual-track-api

# 或指定名称（如果可用）
heroku create coal-dual-track-api --region us
```

#### 3. 创建必要的配置文件

**Procfile**（没有扩展名）：
```
web: python api_server_robust.py
```

**runtime.txt**：
```
python-3.11.0
```

#### 4. 设置环境变量
```bash
# 设置Python路径
heroku config:set PYTHONPATH=/app

# 禁用生产环境调试
heroku config:set FLASK_ENV=production
```

#### 5. 部署到Heroku
```bash
# 提交更改到Git（如果还没有）
git add .
git commit -m "准备Heroku部署"

# 推送到Heroku
git push heroku main

# 查看部署日志
heroku logs --tail
```

#### 6. 验证部署
```bash
# 检查应用状态
heroku ps

# 获取应用URL
heroku open

# 测试API
curl https://coal-dual-track-api.herokuapp.com/api/status
```

### ⚠️ Heroku注意事项：
1. **免费层限制**：每月550运行小时，需要信用卡验证
2. **休眠机制**：30分钟无访问会休眠，下次访问有延迟
3. **费用**：如果需要24/7运行，需升级到付费计划（$7/月起）

## 🐍 部署方案二：PythonAnywhere（最简单）

### 优点：
- 专门为Python设计
- 免费计划足够小型API使用
- 无需信用卡

### 部署步骤：

#### 1. 注册PythonAnywhere
- 访问 https://www.pythonanywhere.com
- 注册免费账户

#### 2. 上传文件
1. 登录后点击 **Files** 标签
2. 点击 **Upload a file** 按钮
3. 上传以下文件：
   - `api_server_robust.py`
   - `requirements.txt`
   - `frontend/` 目录（如果需要）

#### 3. 创建虚拟环境
1. 点击 **Consoles** 标签
2. 点击 **Bash** 创建一个新的控制台
3. 创建虚拟环境：
   ```bash
   mkvirtualenv coal-api --python=/usr/bin/python3.8
   pip install -r requirements.txt
   ```

#### 4. 创建Web应用
1. 点击 **Web** 标签
2. 点击 **Add a new web app**
3. 选择 **Manual configuration**
4. 选择 **Python 3.8**
5. 配置WSGI文件：
   编辑 `/var/www/yourusername_pythonanywhere_com_wsgi.py`：
   ```python
   import sys
   path = '/home/yourusername/coal-price-prediction-web'
   if path not in sys.path:
       sys.path.append(path)
   
   from api_server_robust import app as application
   ```

#### 5. 配置静态文件和虚拟环境
1. 在Web配置页面：
   - Virtualenv: `/home/yourusername/.virtualenvs/coal-api`
   - 根据需要配置静态文件映射

#### 6. 重启应用
点击 **Reload** 按钮

### ⚠️ PythonAnywhere注意事项：
1. **CPU限制**：免费账户每天100秒CPU时间
2. **磁盘限制**：512MB存储空间
3. **适合小型API**：如果访问量不大，免费计划足够

## 🚆 部署方案三：Railway（现代平台）

### 优点：
- 每月5美元免费额度
- 自动部署GitHub仓库
- 现代化界面

### 部署步骤：

#### 1. 注册Railway
- 访问 https://railway.app
- 使用GitHub账号登录

#### 2. 创建新项目
1. 点击 **New Project**
2. 选择 **Deploy from GitHub repo**
3. 连接到你的GitHub仓库

#### 3. 配置部署
Railway会自动检测Python项目，需要确保有：

**railway.json**（可选）：
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pip install -r requirements.txt"
  },
  "deploy": {
    "startCommand": "python api_server_robust.py",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### 4. 设置环境变量
在Railway Dashboard中添加：
```
PORT=8080
PYTHONPATH=/app
```

#### 5. 部署
Railway会自动部署，生成域名如：
`https://coal-dual-track-api.up.railway.app`

## 🔧 部署后的重要配置

### 1. 更新前端API地址
修改 `frontend/app_api_integration.js` 和 `frontend/app_api_integration_enhanced.js`：

```javascript
// 根据你的云平台URL更新
const API_BASE_URL = 'https://coal-dual-track-api.herokuapp.com/api';
// 或
const API_BASE_URL = 'https://yourusername.pythonanywhere.com/api';
// 或
const API_BASE_URL = 'https://coal-dual-track-api.up.railway.app/api';
```

### 2. CORS配置
确保API服务器允许GitHub Pages域名的跨域请求。在 `api_server_robust.py` 中修改：

```python
# 添加允许的域名
CORS(app, origins=[
    'https://bigflyanpu.github.io',
    'https://yourusername.github.io',
    'http://localhost:8000',
    'http://localhost:5002'
])
```

### 3. 修改GitHub Pages网站
重新提交包含更新API地址的前端代码到GitHub。

## 💰 成本分析与免费选项

### 完全免费方案（适合学生/个人项目）：
1. **GitHub Pages**：免费托管静态网站
2. **PythonAnywhere免费计划**：运行API（注意CPU限制）
3. **总成本**：$0

### 低成本方案（推荐）：
1. **GitHub Pages**：免费
2. **Heroku Hobby计划**：$7/月（24/7运行）
3. **总成本**：$7/月

### 性能方案：
1. **VPS（DigitalOcean等）**：$5-10/月
2. **需要自己配置**：Nginx + Gunicorn + Flask
3. **最灵活**：完全控制

## 🛠️ 生产环境优化建议

### 1. 使用Gunicorn（生产级WSGI服务器）
创建 `gunicorn_config.py`：
```python
bind = "0.0.0.0:8080"
workers = 2
threads = 4
worker_class = "sync"
```

启动命令改为：
```bash
gunicorn --config gunicorn_config.py api_server_robust:app
```

### 2. 添加健康检查端点
在 `api_server_robust.py` 中添加：
```python
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})
```

### 3. 配置日志
```python
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
```

## 📊 监控和维护

### 基本监控：
1. **日志查看**：定期检查API日志
2. **性能监控**：监控响应时间和错误率
3. **用户反馈**：收集用户使用反馈

### 维护任务：
1. **定期更新**：更新依赖包
2. **备份配置**：备份重要配置
3. **监控费用**：关注云平台费用

## 🚨 故障排除

### 常见问题：

#### 1. API无法访问
- 检查云平台服务状态
- 查看应用日志
- 验证端口配置

#### 2. CORS错误
```
Access-Control-Allow-Origin 错误
```
解决方案：在CORS配置中添加你的域名

#### 3. 内存不足
- 优化代码，减少内存使用
- 升级云平台套餐
- 使用更高效的数据结构

#### 4. 响应慢
- 检查网络延迟
- 优化API响应时间
- 考虑使用CDN

## 📞 技术支持

如果遇到问题：
1. **查看云平台文档**：Heroku/PythonAnywhere等官方文档
2. **Stack Overflow**：搜索类似问题
3. **GitHub Issues**：在你的仓库提issue
4. **联系我**：通过项目文档中的联系方式

## ✅ 部署成功验证

部署完成后，验证以下内容：

1. ✅ API状态检查：`GET /api/status` 返回200
2. ✅ 前端连接：网站能成功调用API
3. ✅ 双轨制分析：完整分析功能正常工作
4. ✅ 性能测试：响应时间在合理范围内（<500ms）

## 🎯 总结

将API部署到云端是**必须的**，只有这样才能让其他人24/7访问你的系统。

**推荐方案**：
- **初学者**：PythonAnywhere免费计划
- **有经验者**：Heroku Hobby计划
- **现代派**：Railway

部署完成后，你的双轨制煤炭价格预测系统将成为真正的**在线服务**，任何人都可以通过GitHub Pages网站访问和使用！