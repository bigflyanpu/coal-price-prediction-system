// 煤炭双轨制价格预测系统 - API集成版
// 连接到后端API服务器，提供实时双轨制价格分析

const API_BASE_URL = 'http://localhost:5002/api';
let currentCharts = {};

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔗 煤炭双轨制价格预测系统 - API集成版');
    console.log(`📡 API端点: ${API_BASE_URL}`);
    
    // 初始化日期输入为明天
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateInput = document.getElementById('predictionDate');
    if (dateInput) {
        dateInput.valueAsDate = tomorrow;
    }
    
    // 初始化图表
    initializeChartsWithAPI();
    
    // 绑定事件
    const predictBtn = document.getElementById('predictBtn');
    if (predictBtn) {
        predictBtn.addEventListener('click', performAPIPrediction);
    }
    
    // 绑定双轨制分析按钮
    const dualTrackPredictBtn = document.getElementById('dualTrackPredictBtn');
    if (dualTrackPredictBtn) {
        dualTrackPredictBtn.addEventListener('click', performDualTrackAnalysis);
    }
    
    // 初始化工具提示
    initializeTooltips();
    
    // 检查API状态并加载初始数据
    checkAPIStatus();
});

// 初始化工具提示
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// 检查API状态
async function checkAPIStatus() {
    try {
        console.log('🔍 检查API服务器状态...');
        const response = await fetch(`${API_BASE_URL}/status`);
        const data = await response.json();
        
        console.log('✅ API服务器状态:', data);
        
        if (data.status === 'online') {
            showStatusMessage('API服务器已连接', 'success');
            loadInitialDataFromAPI();
        } else {
            showStatusMessage('API服务器状态异常', 'warning');
        }
    } catch (error) {
        console.error('❌ 无法连接到API服务器:', error);
        showStatusMessage('无法连接到API服务器，使用模拟数据模式', 'danger');
        loadFallbackData();
    }
}

// 显示状态消息
function showStatusMessage(message, type = 'info') {
    const alertClass = `alert-${type}`;
    const icon = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '❌';
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${alertClass} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.style.maxWidth = '300px';
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
        <strong>${icon} ${message}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // 5秒后自动关闭
    setTimeout(() => {
        if (alertDiv.parentNode) {
            const bsAlert = new bootstrap.Alert(alertDiv);
            bsAlert.close();
        }
    }, 5000);
}

// 加载初始数据
async function loadInitialDataFromAPI() {
    try {
        console.log('📥 从API加载初始数据...');
        
        // 并行加载多个数据
        const [marketTrend, quickAnalysis, priceHistory] = await Promise.all([
            fetch(`${API_BASE_URL}/market/trend`).then(r => r.json()),
            fetch(`${API_BASE_URL}/dual-track/quick`).then(r => r.json()),
            fetch(`${API_BASE_URL}/price/history?period=daily&days=30`).then(r => r.json())
        ]);
        
        console.log('✅ 初始数据加载完成');
        
        // 更新UI
        updateMarketTrend(marketTrend);
        updateQuickAnalysis(quickAnalysis);
        updatePriceChart(priceHistory);
        
    } catch (error) {
        console.error('❌ 加载初始数据失败:', error);
        loadFallbackData();
    }
}

// 加载后备数据（当API不可用时）
function loadFallbackData() {
    console.log('🔄 加载后备数据...');
    
    // 生成模拟数据
    const mockTrend = {
        success: true,
        analysis: {
            futures_trend: 'flat',
            stocks_trend: 'flat',
            inventory_trend: 'stable',
            composite_score: 0.5,
            inventory_level: 400,
            market_sentiment: 'neutral'
        }
    };
    
    const mockAnalysis = {
        success: true,
        market_price: 826.0,
        planned_price: 764.86,
        price_difference: 61.14,
        price_difference_pct: 8.0,
        recommendation: '观望',
        confidence: 0.6,
        risk_level: '中等',
        futures_trend: 'flat',
        composite_score: 0.5,
        note: '使用模拟数据（API服务器未连接）'
    };
    
    const mockHistory = generateMockPriceHistory('daily', 30);
    
    updateMarketTrend(mockTrend);
    updateQuickAnalysis(mockAnalysis);
    updatePriceChart(mockHistory);
}

// 更新市场趋势
function updateMarketTrend(data) {
    if (!data.success || !data.analysis) return;
    
    const analysis = data.analysis;
    console.log('📈 市场趋势更新:', analysis);
    
    // 更新趋势显示
    updateTrendDisplay('futures', analysis.futures_trend);
    updateTrendDisplay('stocks', analysis.stocks_trend);
    updateTrendDisplay('inventory', analysis.inventory_trend);
    
    // 更新综合评分
    if (analysis.composite_score !== undefined) {
        const scoreElement = document.getElementById('compositeScore');
        if (scoreElement) {
            scoreElement.textContent = analysis.composite_score.toFixed(2);
            updateScoreColor(scoreElement, analysis.composite_score);
        }
    }
}

// 更新趋势显示
function updateTrendDisplay(type, trend) {
    const element = document.getElementById(`${type}Trend`);
    if (!element) return;
    
    const trendMap = {
        'up': { text: '上涨', icon: '📈', color: 'text-success' },
        'down': { text: '下跌', icon: '📉', color: 'text-danger' },
        'flat': { text: '震荡', icon: '➡️', color: 'text-warning' },
        'stable': { text: '稳定', icon: '⚖️', color: 'text-info' }
    };
    
    const trendInfo = trendMap[trend] || { text: trend, icon: '❓', color: 'text-muted' };
    
    element.innerHTML = `
        <span class="${trendInfo.color}">
            <i class="fas fa-${trend === 'up' ? 'arrow-up' : trend === 'down' ? 'arrow-down' : 'minus'} me-1"></i>
            ${trendInfo.text} ${trendInfo.icon}
        </span>
    `;
}

// 更新评分颜色
function updateScoreColor(element, score) {
    if (score >= 0.7) {
        element.className = 'text-success fw-bold';
    } else if (score >= 0.6) {
        element.className = 'text-warning fw-bold';
    } else if (score >= 0.4) {
        element.className = 'text-info fw-bold';
    } else {
        element.className = 'text-danger fw-bold';
    }
}

// 更新快速分析
function updateQuickAnalysis(data) {
    if (!data.success) return;
    
    console.log('💰 快速分析更新:', data);
    
    // 更新价格显示
    updatePriceDisplay('market', data.market_price);
    updatePriceDisplay('planned', data.planned_price);
    updatePriceDisplay('difference', data.price_difference);
    updatePriceDisplay('differencePct', data.price_difference_pct);
    
    // 更新建议
    updateRecommendation(data.recommendation, data.confidence, data.risk_level);
    
    // 更新趋势
    updateTrendDisplay('futures', data.futures_trend);
    
    // 更新综合评分
    if (data.composite_score !== undefined) {
        const scoreElement = document.getElementById('compositeScore');
        if (scoreElement) {
            scoreElement.textContent = data.composite_score.toFixed(2);
            updateScoreColor(scoreElement, data.composite_score);
        }
    }
    
    // 显示API模式提示
    if (data.note) {
        showStatusMessage(data.note, 'info');
    }
}

// 更新价格显示
function updatePriceDisplay(type, value) {
    const element = document.getElementById(`${type}Price`);
    if (!element) return;
    
    if (typeof value === 'number') {
        element.textContent = value.toFixed(2);
    } else {
        element.textContent = value;
    }
    
    // 为价差添加颜色
    if (type === 'differencePct') {
        const numValue = typeof value === 'number' ? value : parseFloat(value);
        if (numValue > 12) {
            element.className = 'text-danger fw-bold';
        } else if (numValue > 8) {
            element.className = 'text-warning fw-bold';
        } else if (numValue < 4) {
            element.className = 'text-success fw-bold';
        } else {
            element.className = 'text-info fw-bold';
        }
    }
}

// 更新建议
function updateRecommendation(action, confidence, riskLevel) {
    const actionElement = document.getElementById('recommendationAction');
    const confidenceElement = document.getElementById('recommendationConfidence');
    const riskElement = document.getElementById('recommendationRisk');
    
    if (actionElement) {
        actionElement.textContent = action;
        
        // 根据建议类型设置颜色
        if (action.includes('卖出')) {
            actionElement.className = 'text-danger fw-bold';
        } else if (action.includes('买入')) {
            actionElement.className = 'text-success fw-bold';
        } else {
            actionElement.className = 'text-warning fw-bold';
        }
    }
    
    if (confidenceElement && confidence !== undefined) {
        confidenceElement.textContent = `${(confidence * 100).toFixed(1)}%`;
        
        // 根据置信度设置颜色
        if (confidence >= 0.7) {
            confidenceElement.className = 'text-success fw-bold';
        } else if (confidence >= 0.6) {
            confidenceElement.className = 'text-warning fw-bold';
        } else {
            confidenceElement.className = 'text-danger fw-bold';
        }
    }
    
    if (riskElement && riskLevel) {
        riskElement.textContent = riskLevel;
        
        // 根据风险等级设置颜色
        if (riskLevel.includes('低')) {
            riskElement.className = 'text-success fw-bold';
        } else if (riskLevel.includes('中')) {
            riskElement.className = 'text-warning fw-bold';
        } else {
            riskElement.className = 'text-danger fw-bold';
        }
    }
}

// 初始化图表
function initializeChartsWithAPI() {
    // 价格走势图
    const priceChartCtx = document.getElementById('priceChart');
    if (priceChartCtx) {
        currentCharts.price = new Chart(priceChartCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: '市场价格',
                        data: [],
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.3,
                        fill: true,
                        borderWidth: 2
                    },
                    {
                        label: '计划价格',
                        data: [],
                        borderColor: '#2ecc71',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        tension: 0.3,
                        fill: true,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ¥${context.parsed.y.toFixed(2)}/吨`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '日期'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '价格（元/吨）'
                        },
                        beginAtZero: false
                    }
                }
            }
        });
    }
    
    // 精度对比图
    const accuracyChartCtx = document.getElementById('accuracyChart');
    if (accuracyChartCtx) {
        currentCharts.accuracy = new Chart(accuracyChartCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['日度', '月度', '年度'],
                datasets: [
                    {
                        label: '预测精度 (MAPE %)',
                        data: [4.7, 3.9, 2.8],
                        backgroundColor: ['#3498db', '#2ecc71', '#e74c3c']
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '平均绝对百分比误差 (%)'
                        }
                    }
                }
            }
        });
    }
}

// 更新价格图表
function updatePriceChart(data) {
    if (!data.success || !data.prices) return;
    
    const chart = currentCharts.price;
    if (!chart) return;
    
    const prices = data.prices;
    
    chart.data.labels = prices.labels;
    chart.data.datasets[0].data = prices.market || [];
    chart.data.datasets[1].data = prices.planned || [];
    
    chart.update();
    
    console.log('📈 价格图表已更新');
}

// 执行API预测
async function performAPIPrediction() {
    const params = getPredictionParams();
    
    // 显示加载指示器
    showLoading(true);
    
    try {
        console.log('🚀 发送API预测请求:', params);
        
        const response = await fetch(`${API_BASE_URL}/dual-track/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ API预测成功:', data);
            displayPredictionResult(data);
        } else {
            console.error('❌ API预测失败:', data.error);
            showError('预测失败: ' + (data.error || '未知错误'));
        }
        
    } catch (error) {
        console.error('❌ 预测请求失败:', error);
        showError('网络错误: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// 获取预测参数
function getPredictionParams() {
    const timeScale = document.getElementById('timeScale')?.value || 'daily';
    const coalType = document.getElementById('coalType')?.value || 'thermal';
    const dateInput = document.getElementById('predictionDate')?.value;
    
    // 根据煤炭类型设置基础价格
    const basePrices = {
        thermal: 850,
        coking: 950,
        anthracite: 900
    };
    
    const basePrice = basePrices[coalType] || 850;
    
    return {
        days_back: 7,
        base_price: basePrice,
        coal_type: coalType,
        time_scale: timeScale
    };
}

// 显示加载状态
function showLoading(show) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const predictionResult = document.getElementById('predictionResult');
    
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? 'block' : 'none';
    }
    
    if (predictionResult && !show) {
        predictionResult.style.display = 'block';
    }
}

// 显示预测结果
function displayPredictionResult(data) {
    const resultContainer = document.getElementById('predictionResult');
    if (!resultContainer) return;
    
    const priceResults = data.price_results;
    const recommendation = data.recommendation;
    const dataSummary = data.data_summary;
    
    let html = `
        <div class="alert alert-success">
            <i class="fas fa-check-circle me-2"></i>
            <strong>预测完成</strong>
            <small class="d-block mt-1">时间: ${new Date().toLocaleString()}</small>
        </div>
        
        <div class="row text-center mb-4">
            <div class="col-md-4">
                <div class="p-3 bg-light rounded">
                    <small class="text-muted">市场价格预测</small>
                    <h3 class="text-primary">¥${priceResults.market_price.toFixed(2)}</h3>
                    <span class="badge bg-primary">元/吨</span>
                </div>
            </div>
            <div class="col-md-4">
                <div class="p-3 bg-light rounded">
                    <small class="text-muted">计划价格预测</small>
                    <h3 class="text-success">¥${priceResults.planned_price.toFixed(2)}</h3>
                    <span class="badge bg-success">元/吨</span>
                </div>
            </div>
            <div class="col-md-4">
                <div class="p-3 bg-light rounded">
                    <small class="text-muted">价差</small>
                    <h3 class="${priceResults.price_difference_pct > 12 ? 'text-danger' : priceResults.price_difference_pct > 8 ? 'text-warning' : 'text-info'}">
                        ${priceResults.price_difference_pct.toFixed(1)}%
                    </h3>
                    <span class="badge ${priceResults.price_difference_pct > 12 ? 'bg-danger' : priceResults.price_difference_pct > 8 ? 'bg-warning' : 'bg-info'}">
                        ¥${priceResults.price_difference.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
        
        <div class="row mb-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header bg-info text-white">
                        <h6 class="mb-0"><i class="fas fa-chart-line me-2"></i>交易建议</h6>
                    </div>
                    <div class="card-body">
                        <h4 class="${recommendation.action.includes('卖出') ? 'text-danger' : recommendation.action.includes('买入') ? 'text-success' : 'text-warning'}">
                            ${recommendation.action}
                        </h4>
                        <p class="mb-2">${recommendation.reason}</p>
                        <div class="d-flex justify-content-between">
                            <span>置信度: <strong class="${recommendation.confidence >= 0.7 ? 'text-success' : recommendation.confidence >= 0.6 ? 'text-warning' : 'text-danger'}">
                                ${(recommendation.confidence * 100).toFixed(1)}%
                            </strong></span>
                            <span>风险等级: <strong class="${recommendation.risk_level.includes('低') ? 'text-success' : recommendation.risk_level.includes('中') ? 'text-warning' : 'text-danger'}">
                                ${recommendation.risk_level}
                            </strong></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header bg-secondary text-white">
                        <h6 class="mb-0"><i class="fas fa-database me-2"></i>数据统计</h6>
                    </div>
                    <div class="card-body">
                        <div class="row text-center">
                            <div class="col-6">
                                <small class="text-muted">期货数据</small>
                                <h5>${dataSummary.futures_data_count || 0} 条</h5>
                            </div>
                            <div class="col-6">
                                <small class="text-muted">库存数据</small>
                                <h5>${dataSummary.inventory_data_count || 0} 条</h5>
                            </div>
                            <div class="col-12 mt-2">
                                <small class="text-muted">特征数量</small>
                                <h5>${dataSummary.feature_count || 0} 个</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header bg-purple text-white">
                <h6 class="mb-0"><i class="fas fa-cogs me-2"></i>市场分析</h6>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <small class="text-muted">期货趋势</small>
                        <h5>${formatTrend(priceResults.base_analysis?.futures_trend)}</h5>
                    </div>
                    <div class="col-md-6">
                        <small class="text-muted">综合评分</small>
                        <h5 class="${priceResults.base_analysis?.composite_score >= 0.7 ? 'text-success' : priceResults.base_analysis?.composite_score >= 0.6 ? 'text-warning' : 'text-danger'}">
                            ${(priceResults.base_analysis?.composite_score || 0.5).toFixed(2)}
                        </h5>
                    </div>
                    <div class="col-md-6">
                        <small class="text-muted">库存水平</small>
                        <h5>${priceResults.base_analysis?.inventory_level || 0} 万吨</h5>
                    </div>
                    <div class="col-md-6">
                        <small class="text-muted">政策强度</small>
                        <h5>${(priceResults.fused_features_summary?.policy_avg_intensity || 0).toFixed(2)}</h5>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="mt-3">
            <button class="btn btn-primary" onclick="refreshPrediction()">
                <i class="fas fa-sync-alt me-2"></i>刷新预测
            </button>
            <button class="btn btn-outline-secondary ms-2" onclick="showDetailedReport()">
                <i class="fas fa-file-alt me-2"></i>查看详细报告
            </button>
        </div>
    `;
    
    resultContainer.innerHTML = html;
}

// 格式化趋势
function formatTrend(trend) {
    const trendMap = {
        'up': '<span class="text-success">上涨 📈</span>',
        'down': '<span class="text-danger">下跌 📉</span>',
        'flat': '<span class="text-warning">震荡 ➡️</span>',
        'stable': '<span class="text-info">稳定 ⚖️</span>'
    };
    
    return trendMap[trend] || `<span class="text-muted">${trend || '未知'} ❓</span>`;
}

// 显示错误
function showError(message) {
    const resultContainer = document.getElementById('predictionResult');
    if (!resultContainer) return;
    
    resultContainer.innerHTML = `
        <div class="alert alert-danger">
            <i class="fas fa-exclamation-triangle me-2"></i>
            <strong>预测错误</strong>
            <p class="mb-0 mt-1">${message}</p>
            <button class="btn btn-sm btn-outline-danger mt-2" onclick="retryPrediction()">
                <i class="fas fa-redo me-1"></i>重试
            </button>
        </div>
    `;
}

// 重试预测
function retryPrediction() {
    performAPIPrediction();
}

// 刷新预测
function refreshPrediction() {
    performAPIPrediction();
}

// 显示详细报告
function showDetailedReport() {
    alert('详细报告功能正在开发中...');
}

// 生成模拟价格历史
function generateMockPriceHistory(period, days) {
    const baseMarket = 826.0;
    const basePlanned = 764.86;
    
    const labels = [];
    const market = [];
    const planned = [];
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        if (period === 'daily') {
            labels.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }));
        } else if (period === 'monthly') {
            if (date.getDate() === 1) {
                labels.push(date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' }));
            }
        }
        
        // 生成价格数据
        const dayFactor = i / days;
        const seasonal = Math.sin(dayFactor * 2 * Math.PI) * 30;
        const trend = i * 0.5;
        const noise = (Math.random() - 0.5) * 20;
        
        market.push(baseMarket + seasonal + trend + noise);
        planned.push(basePlanned + seasonal * 0.8 + trend * 0.9 + noise * 0.7);
    }
    
    // 如果标签为空，使用简化标签
    if (labels.length === 0) {
        for (let i = 0; i < Math.min(10, days); i++) {
            labels.push(`Day ${i + 1}`);
        }
        market.length = labels.length;
        planned.length = labels.length;
    }
    
    return {
        success: true,
        prices: {
            labels: labels,
            market: market.map(p => Math.round(p * 100) / 100),
            planned: planned.map(p => Math.round(p * 100) / 100)
        }
    };
}

// 页面加载完成后的额外初始化
window.addEventListener('load', function() {
    console.log('🚀 双轨制价格预测系统完全加载');
    
    // 显示系统状态
    const statusElement = document.createElement('div');
    statusElement.className = 'alert alert-info alert-dismissible fade show position-fixed bottom-0 end-0 m-3';
    statusElement.style.zIndex = '9999';
    statusElement.style.maxWidth = '300px';
    statusElement.innerHTML = `
        <i class="fas fa-server me-2"></i>
        <strong>系统已就绪</strong>
        <p class="mb-0 small">双轨制价格预测系统</p>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(statusElement);
    
    // 5秒后自动关闭
    setTimeout(() => {
        if (statusElement.parentNode) {
            const bsAlert = new bootstrap.Alert(statusElement);
            bsAlert.close();
        }
    }, 5000);
});