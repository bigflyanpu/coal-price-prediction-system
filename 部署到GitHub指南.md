# 双轨制价格预测系统部署到GitHub指南

## 系统概述
基于中国双轨制定价体系的煤炭价格预测系统已成功集成到现有GitHub网站。系统包含完整的API服务和前端界面，提供稳健的双轨制价格预测功能。

## 部署步骤

### 1. 文件准备
需要上传到GitHub仓库的文件：

```
coal_price_prediction_web/
├── index.html                    # 主网站界面（已集成双轨制功能）
├── api_server_robust.py          # 稳健版API服务器
├── requirements.txt              # Python依赖
├── frontend/
│   ├── app_api_integration.js    # 基础API集成
│   └── app_api_integration_enhanced.js # 双轨制增强功能
├── test_integration.html         # API测试页面
└── 部署到GitHub指南.md           # 本文件
```

### 2. GitHub Pages配置
1. 将文件上传到GitHub仓库
2. 在仓库设置中启用GitHub Pages
3. 选择主分支的 `/docs` 文件夹或根目录作为发布源
4. 访问地址：`https://[用户名].github.io/[仓库名]/`

### 3. API服务器部署
由于GitHub Pages是静态托管，API服务器需要单独部署。推荐选项：

#### 选项A：Heroku部署（推荐）
```bash
# 1. 创建Heroku应用
heroku create coal-dual-track-api

# 2. 添加Procfile
echo "web: python api_server_robust.py" > Procfile

# 3. 设置环境变量
heroku config:set PYTHONPATH=/app

# 4. 部署到Heroku
git push heroku main

# 5. 查看日志
heroku logs --tail
```

#### 选项B：本地运行（开发测试）
```bash
# 启动API服务器
python3 api_server_robust.py

# 服务器将在 http://localhost:5002 运行
# 网站将在 http://localhost:8000 运行
```

#### 选项C：PythonAnywhere部署
1. 在PythonAnywhere创建Web应用
2. 上传所有文件
3. 配置WSGI文件指向api_server_robust.py
4. 修改前端API_BASE_URL为PythonAnywhere域名

### 4. 网站配置调整

#### 更新API端点
在 `frontend/app_api_integration.js` 和 `frontend/app_api_integration_enhanced.js` 中：

```javascript
// 开发环境
const API_BASE_URL = 'http://localhost:5002/api';

// 生产环境（Heroku部署）
const API_BASE_URL = 'https://coal-dual-track-api.herokuapp.com/api';

// 生产环境（PythonAnywhere部署）
const API_BASE_URL = 'https://[用户名].pythonanywhere.com/api';
```

#### CORS配置
确保API服务器允许GitHub Pages域名的跨域请求：
```python
# 在api_server_robust.py中
CORS(app, origins=[
    'https://[用户名].github.io',
    'http://localhost:8000',
    'http://localhost:5002'
])
```

### 5. 测试部署

#### 本地测试
1. 启动API服务器：
   ```bash
   python3 api_server_robust.py
   ```
2. 启动本地HTTP服务器：
   ```bash
   python3 -m http.server 8000
   ```
3. 访问 `http://localhost:8000` 测试网站
4. 访问 `http://localhost:5002/test_integration.html` 测试API

#### 生产测试
1. 访问GitHub Pages网站
2. 检查浏览器控制台有无错误
3. 测试双轨制分析功能
4. 验证API连接状态

## 系统功能验证

### 验证API连接
网站右上角会显示API连接状态：
- ✅ 已连接：API服务器正常工作
- ❌ 连接失败：需要检查API服务器部署

### 测试双轨制功能
1. 进入"双轨制价格预测系统"区域
2. 点击"刷新状态"按钮
3. 设置分析参数（煤炭类型、基础价格、回溯天数）
4. 点击"执行双轨制分析"
5. 验证价格预测和交易建议显示

### 测试价格历史图表
1. 页面会自动加载30天价格历史
2. 图表应显示市场价格和计划价格的对比
3. 点击"刷新价格历史"按钮更新数据

## 故障排除

### 常见问题

#### 1. API连接失败
- 检查API服务器是否运行
- 检查API_BASE_URL配置是否正确
- 查看浏览器控制台错误信息

#### 2. CORS错误
```
Access to fetch at 'http://localhost:5002/api/status' from origin 'http://localhost:8000' 
has been blocked by CORS policy
```
解决方案：在API服务器中添加正确的CORS配置。

#### 3. 端口冲突
如果5002端口被占用，修改api_server_robust.py中的端口：
```python
app.run(host='0.0.0.0', port=5003, debug=False, use_reloader=False)
```

#### 4. Python依赖问题
确保安装所有依赖：
```bash
pip install -r requirements.txt
```

## 维护指南

### 更新网站
1. 修改网站文件（HTML/CSS/JS）
2. 提交到GitHub仓库
3. GitHub Pages会自动部署

### 更新API服务器
1. 修改api_server_robust.py
2. 重新部署到Heroku/PythonAnywhere
3. 测试新功能

### 数据源扩展
当前系统使用模拟数据，可扩展为真实数据源：

1. 集成真实API数据源
2. 修改data_fusion_system_enhanced.py
3. 更新API端点处理逻辑

## 性能优化

### 网站性能
- 使用CDN加载Bootstrap和Chart.js
- 压缩JavaScript文件
- 启用浏览器缓存

### API性能
- 使用Gunicorn多进程部署
- 添加Redis缓存
- 优化数据库查询

## 安全注意事项

### API安全
1. 添加API密钥验证
2. 限制请求频率
3. 使用HTTPS

### 数据安全
1. 敏感数据不存储在客户端
2. 使用环境变量管理API密钥
3. 定期备份数据

## 扩展功能路线图

### 近期计划
1. 添加真实煤炭数据源
2. 实现用户认证系统
3. 增加数据导出功能

### 长期计划
1. 集成机器学习预测模型
2. 添加移动端应用
3. 构建多用户协作平台

## 联系方式
如有部署问题，请通过GitHub Issues反馈。

---

**部署完成提示**：当API服务器状态显示"已连接"，且双轨制分析功能正常工作时，表示系统已成功部署。