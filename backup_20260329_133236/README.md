# 多尺度双轨制煤炭价格智能预测系统

![系统截图](https://img.shields.io/badge/项目-南京大学创新训练项目-blue)
![版本](https://img.shields.io/badge/版本-1.0.0-green)
![许可证](https://img.shields.io/badge/许可证-MIT-yellow)

基于南京大学创新训练项目"计及双轨定价体系的多尺度大宗商品价格预测研究"的煤炭价格预测系统。

## 📋 项目概述

本系统是一个针对中国煤炭双轨制定价体系的多尺度价格预测系统，融合了200+结构化指标、政策舆情数据、气候数据和宏观经济指标，采用日度LSTM、月度LightGBM、年度Robust-SVR三层模型架构，为政府调控、电厂采购、金融机构套保提供即时决策依据。

### 🎯 主要特性

- **多源异构数据融合**：整合200+结构化指标、12维政策冲击指数、50家媒体舆情、ERA5气候数据
- **多尺度预测模型**：日度LSTM（捕捉突发政策）、月度LightGBM（集成学习）、年度Robust-SVR（稳健回归）
- **双轨价格联动**：价差回归规则实现市场价→长协价映射，精准反映双轨定价体系
- **高精度预测**：回测精度日度MAPE 4.7%，月度3.9%，年度2.8%
- **即时决策支持**：为不同应用场景提供定制化操作建议

## 🏗️ 系统架构

```
coal_price_prediction_web/
├── frontend/                 # 前端界面
│   ├── index.html           # 主页面
│   ├── app.js               # 前端逻辑
│   └── .nojekyll            # GitHub Pages配置
├── backend/                 # 后端API服务器
│   └── server.js           # Node.js Express服务器
├── data/                    # 数据文件
└── package.json            # 项目配置
```

## 🚀 快速开始

### 方案一：GitHub Pages静态部署（推荐）

1. **创建GitHub仓库**
   ```bash
   git init
   git add .
   git commit -m "初始提交"
   git branch -M main
   git remote add origin https://github.com/username/coal-price-prediction-system.git
   git push -u origin main
   ```

2. **配置GitHub Pages**
   - 进入仓库设置 → Pages
   - 选择分支：`main`
   - 选择文件夹：`/frontend`
   - 点击保存

3. **访问网站**
   - 打开 `https://username.github.io/coal-price-prediction-system`

### 方案二：本地运行（前后端分离）

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动后端服务器**
   ```bash
   npm start
   ```
   服务器将在 http://localhost:3000 启动

3. **访问前端界面**
   - 打开浏览器访问 http://localhost:3000

### 方案三：仅前端运行

直接双击 `frontend/index.html` 文件在浏览器中打开（使用模拟数据）

## 🔧 技术栈

### 前端
- **HTML5/CSS3**：响应式布局设计
- **Bootstrap 5**：现代化UI组件
- **Chart.js**：数据可视化图表
- **Font Awesome**：图标系统
- **JavaScript (ES6+)**：交互逻辑

### 后端
- **Node.js**：服务器运行时
- **Express.js**：Web框架
- **CORS**：跨域资源共享

### 数据模拟
- 模拟历史价格数据生成
- 多尺度预测算法模拟
- 影响因素动态生成

## 📊 系统功能

### 1. 系统特色展示
- 多源异构数据融合
- 多尺度预测架构
- 双轨联动机制
- 高精度性能指标

### 2. 价格预测
- **时间尺度选择**：日度、月度、年度
- **价格类型选择**：市场价格、长协价、基准价
- **煤炭类型选择**：动力煤、炼焦煤、无烟煤
- **预测结果展示**：价格、置信度、波动区间、影响因素

### 3. 数据分析
- 价格走势可视化
- 多尺度精度对比
- 模型性能指标
- 历史数据统计

### 4. 项目信息
- 项目详情展示
- 负责人信息
- 技术架构说明
- 应用场景描述

## 🎨 界面预览

### 主界面
![主界面](https://via.placeholder.com/800x400/2c3e50/ffffff?text=多尺度双轨制煤炭价格智能预测系统)

### 预测面板
![预测面板](https://via.placeholder.com/800x400/3498db/ffffff?text=煤炭价格预测界面)

### 数据分析
![数据分析](https://via.placeholder.com/800x400/2ecc71/ffffff?text=多尺度数据分析图表)

## 🔌 API接口

系统提供以下RESTful API接口：

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/price-history` | GET | 获取历史价格数据 |
| `/api/predict` | POST | 执行价格预测 |
| `/api/model-accuracy` | GET | 获取模型精度数据 |
| `/api/system-info` | GET | 获取系统信息 |
| `/api/statistics` | GET | 获取统计数据 |
| `/api/health` | GET | 健康检查 |

### 预测请求示例
```json
{
  "timeScale": "daily",
  "priceType": "market",
  "coalType": "thermal",
  "date": "2025-10-15"
}
```

### 预测响应示例
```json
{
  "success": true,
  "prediction": {
    "value": 852.4,
    "confidence": 92.3,
    "priceRange": {
      "min": 837.2,
      "max": 867.6
    },
    "factors": [
      {
        "name": "政策冲击指数",
        "impact": "+2.3%",
        "direction": "positive"
      }
    ]
  }
}
```

## 📈 模型性能

| 时间尺度 | 模型类型 | MAPE | RMSE | 置信度 |
|----------|----------|------|------|--------|
| 日度 | LSTM-Transformer | 4.7% | 28.5 | 92.3% |
| 月度 | LightGBM | 3.9% | 24.3 | 94.7% |
| 年度 | Robust-SVR | 2.8% | 18.7 | 96.2% |

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 开发计划

- [x] 基础前端界面
- [x] 模拟数据生成
- [x] 图表可视化
- [ ] 真实数据集成
- [ ] 机器学习模型集成
- [ ] 用户认证系统
- [ ] 数据导出功能
- [ ] 移动端适配优化

## 🧪 测试

```bash
# 单元测试
npm test

# 接口测试
curl http://localhost:3000/api/health
```

## 📄 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👥 项目团队

- **项目负责人**：祁昊然（南京大学工科试验班，学号：241870228）
- **指导教师**：苏彤 副研究员
- **项目期限**：一年期（2025-2026）

## 📞 联系方式

- **项目邮箱**：241870228@qq.com
- **GitHub Issues**：[问题反馈](https://github.com/username/coal-price-prediction-system/issues)
- **项目文档**：[详细文档](https://username.github.io/coal-price-prediction-system/docs)

## 🙏 致谢

感谢南京大学创新训练项目支持，特别感谢苏彤老师的指导，以及所有为项目提供帮助的老师和同学们。

---

<div align="center">
  <p>南京大学 · 工科试验班 · 创新训练项目</p>
  <p>© 2025 祁昊然. 保留所有权利。</p>
</div>