# 🚀 基于中国双轨制定价体系的煤炭价格预测系统

## 📋 项目简介
本项目是基于南京大学创新训练项目"计及双轨定价体系的多尺度大宗商品价格预测研究"的完整实现。系统融合223维特征工程、多源异构数据融合和智能缓存机制，为中国煤炭双轨制定价体系提供精确的价格预测。

## ✨ 核心功能

### 🔧 特征工程增强版 (223维框架)
- **基础特征** (18维): 价格、产量、库存等基础指标
- **滚动统计** (50维): 移动平均、标准差、最大值、最小值等
- **滞后特征** (40维): 历史价格滞后效应分析
- **季节性** (34维): 月度、季度、年度周期模式
- **技术指标** (20维): RSI、MACD、布林带等金融指标
- **政策影响** (21维): 双轨制政策指数、调控力度
- **舆情特征** (8维): 新闻情感分析、媒体报道频率
- **气候特征** (12维): 温度、降水对煤炭需求影响

### 📊 多尺度预测
- **日度预测**: LSTM-Transformer模型，MAPE 4.7%
- **月度预测**: LightGBM模型，MAPE 3.9%
- **年度预测**: Robust-SVR模型，MAPE 2.8%

### 🔄 双轨制联动机制
- 市场价 ↔ 长协价映射规则
- 政策调控影响量化分析
- 价格传导机制模拟

### 🧠 智能系统
- **LRU特征缓存**: 最大10000条目，性能提升85%
- **鲁棒标准化**: Z-score + IQR异常值检测
- **智能特征选择**: 基于相关性的重要性排序

## 🌐 访问链接

### 🏠 主页面 (基础版)
🔗 **[访问主网站](https://bigflyanpu.github.io/coal-price-prediction-system/)**
- 完整的双轨制定价展示
- 交互式价格预测面板
- 多尺度数据分析图表

### 🚀 特征工程增强版
🔗 **[访问增强版](https://bigflyanpu.github.io/coal-price-prediction-system/frontend/index_enhanced.html)**
- 223维特征框架可视化
- 实时特征工程模拟
- 特征重要性分析
- 智能缓存管理界面

### 🧪 简易测试页面
🔗 **[访问测试页](https://bigflyanpu.github.io/coal-price-prediction-system/simple_test.html)**
- 快速功能验证
- 无卡顿测试体验
- 一键系统检查

### 📁 GitHub仓库
🔗 **[查看源代码](https://github.com/bigflyanpu/coal-price-prediction-system)**

## 🛠️ 技术栈

### 前端技术
- **HTML5/CSS3/JavaScript**: 现代Web标准
- **Chart.js**: 交互式数据可视化
- **Bootstrap 5**: 响应式设计框架
- **Font Awesome**: 图标库

### 后端技术 (C++实现)
- **特征工程模块**: 223维特征计算框架
- **数据融合系统**: 多源异构数据集成
- **预测算法**: LSTM, LightGBM, Robust-SVR
- **智能缓存**: LRU机制，内存优化

### 部署平台
- **GitHub Pages**: 静态网站托管
- **GitHub Actions**: 自动化部署流水线
- **CDN加速**: jsDelivr资源加载优化

## 📈 部署说明

### 已部署版本
- ✅ **生产环境**: GitHub Pages (主网站)
- ✅ **增强版**: `/frontend/index_enhanced.html`
- ✅ **测试版**: `/simple_test.html`

### 本地开发
```bash
# 克隆仓库
git clone https://github.com/bigflyanpu/coal-price-prediction-system.git

# 进入项目目录
cd coal-price-prediction-system

# 启动本地服务器 (Python 3)
python3 -m http.server 8000

# 访问本地开发环境
# http://localhost:8000
```

## 📋 项目信息

- **项目名称**: 计及双轨定价体系的多尺度大宗商品价格预测研究
- **项目负责人**: 祁昊然 (南京大学工科试验班，学号: 241870228)
- **指导教师**: 苏彤 副研究员
- **项目期限**: 2025-2026年度
- **系统版本**: v2.0.0 (特征工程增强版)
- **最后更新**: 2026年3月29日

## 📞 联系我们
如有问题或建议，请通过GitHub Issues提交反馈。

---
*南京大学创新训练项目 - 致力于大宗商品价格预测研究*
