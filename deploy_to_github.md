# 如何将煤炭价格预测系统部署到GitHub Pages

本指南将帮助您将系统部署到GitHub Pages，让所有人都可以通过互联网访问。

## 📋 部署前准备

1. **GitHub账号**：如果没有，请先注册 [GitHub](https://github.com)
2. **Git工具**：确保电脑已安装Git
3. **项目文件**：本地的 `coal_price_prediction_web` 文件夹

## 🚀 部署步骤（5分钟完成）

### 步骤1：创建GitHub仓库

1. 登录GitHub，点击右上角"+" → "New repository"
2. 填写仓库信息：
   - **Repository name**: `coal-price-prediction-system`
   - **Description**: 多尺度双轨制煤炭价格智能预测系统 - 南京大学创新训练项目
   - **Public**（公开仓库，必须选择）
   - **Initialize this repository with a README**: 可选
3. 点击"Create repository"

### 步骤2：上传前端文件到GitHub

打开终端，执行以下命令：

```bash
# 进入项目目录
cd /Users/spike/object_C++/coal_price_prediction_web

# 初始化Git仓库
git init

# 添加前端文件
git add frontend/

# 提交更改
git commit -m "添加煤炭价格预测系统前端文件"

# 连接到GitHub仓库（替换your-username为您的GitHub用户名）
git remote add origin https://github.com/your-username/coal-price-prediction-system.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

### 步骤3：配置GitHub Pages

1. 访问您的仓库页面：`https://github.com/your-username/coal-price-prediction-system`
2. 点击"Settings"（设置）
3. 左侧菜单选择"Pages"（页面）
4. 在"Build and deployment"（构建和部署）部分：
   - **Source**：选择"Deploy from a branch"（从分支部署）
   - **Branch**：选择"main"分支，文件夹选择`/frontend`
5. 点击"Save"（保存）
6. 等待1-2分钟，页面显示"Your site is published at..."（您的网站已发布在...）

### 步骤4：访问您的网站

部署完成后，您的网站将在以下地址发布：
```
https://your-username.github.io/coal-price-prediction-system/
```

**注意**：首次部署可能需要几分钟才能生效。

## 🔗 分享链接

您的网站现在可以被任何人访问！分享以下链接：

- **主网站**: https://your-username.github.io/coal-price-prediction-system/
- **GitHub仓库**: https://github.com/your-username/coal-price-prediction-system

## 📱 功能验证

访问您的网站后，请测试以下功能：

1. ✅ **页面加载**：系统首页正常显示
2. ✅ **参数设置**：可以正常选择时间尺度、价格类型、煤炭类型
3. ✅ **价格预测**：点击"开始预测"按钮，显示预测结果
4. ✅ **图表展示**：价格走势图正常显示
5. ✅ **数据切换**：日度/月度/年度数据切换正常
6. ✅ **响应式设计**：在手机和电脑上都能正常显示

## 🔧 常见问题

### Q1: 网站显示404错误？
- 等待几分钟后刷新
- 确认GitHub Pages配置正确（分支main，文件夹/frontend）
- 确认仓库为公开（Public）状态

### Q2: 图表不显示？
- 检查浏览器控制台是否有错误
- 确认网络连接正常
- 刷新页面重试

### Q3: 如何更新网站内容？
```bash
# 修改文件后
git add .
git commit -m "更新内容"
git push origin main
# 自动重新部署
```

### Q4: 如何自定义域名？
- 在GitHub Pages设置中添加自定义域名
- 在域名服务商处配置CNAME记录

## 🌐 其他部署选项

### 1. Vercel部署（更快的全球访问）
1. 访问 [vercel.com](https://vercel.com) 并注册
2. 导入您的GitHub仓库
3. 一键部署，获得 `*.vercel.app` 域名

### 2. Netlify部署
1. 访问 [netlify.com](https://netlify.com) 并注册
2. 拖拽 `frontend` 文件夹到部署区域
3. 获得 `*.netlify.app` 域名

### 3. 腾讯云/阿里云静态网站托管
- 需要实名认证和少量费用
- 国内访问速度更快

## 📞 技术支持

如果遇到部署问题：

1. **查看GitHub Pages文档**: https://docs.github.com/pages
2. **检查仓库状态**: 确保仓库是公开的
3. **查看部署日志**: 在仓库Settings → Pages页面查看部署状态
4. **联系技术支持**: 在GitHub仓库提交Issue

## 🎉 部署完成！

恭喜！您的煤炭价格预测系统现在已经可以在互联网上被所有人访问了。这个系统展示了南京大学创新训练项目的成果，可以为政府、电厂、金融机构提供决策参考。

**系统特点**：
- 完全免费托管
- 全球可访问
- 无需服务器维护
- 自动HTTPS加密
- 支持自定义域名

**项目信息展示**：
- 南京大学创新训练项目
- 项目负责人：祁昊然（241870228）
- 指导教师：苏彤 副研究员
- 项目期限：一年期（2025-2026）

现在您可以分享这个链接给任何人，展示您的研究成果！