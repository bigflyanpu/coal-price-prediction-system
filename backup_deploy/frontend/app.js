// 多尺度双轨制煤炭价格预测系统 - 前端应用
document.addEventListener('DOMContentLoaded', function() {
    // 初始化日期输入为明天
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('predictionDate').valueAsDate = tomorrow;
    
    // 初始化图表
    initializeCharts();
    
    // 绑定事件
    document.getElementById('predictBtn').addEventListener('click', performPrediction);
    document.querySelectorAll('.btn-group button[data-period]').forEach(btn => {
        btn.addEventListener('click', function() {
            // 更新活动按钮
            document.querySelectorAll('.btn-group button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 更新价格图表数据
            updatePriceChart(this.dataset.period);
        });
    });
    
    // 模拟后端API端点
    window.coalPriceAPI = {
        // 获取价格历史数据
        getPriceHistory: async function(period) {
            return simulateAPIRequest({
                period: period,
                data: generatePriceHistory(period)
            });
        },
        
        // 预测价格
        predictPrice: async function(params) {
            return simulateAPIRequest({
                prediction: generatePrediction(params),
                confidence: generateConfidence(params.timeScale),
                priceRange: generatePriceRange(params.timeScale),
                factors: generateInfluencingFactors(params)
            });
        },
        
        // 获取模型精度数据
        getModelAccuracy: async function() {
            return simulateAPIRequest({
                daily: { mape: 4.7, rmse: 28.5 },
                monthly: { mape: 3.9, rmse: 24.3 },
                yearly: { mape: 2.8, rmse: 18.7 }
            });
        }
    };
    
    // 初始加载数据
    loadInitialData();
});

// 模拟API请求延迟
function simulateAPIRequest(data) {
    return new Promise(resolve => {
        setTimeout(() => resolve(data), 500 + Math.random() * 1000);
    });
}

// 初始化图表
function initializeCharts() {
    // 价格走势图
    const priceChartCtx = document.getElementById('priceChart').getContext('2d');
    window.priceChart = new Chart(priceChartCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: '市场价格（现货价）',
                    data: [],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: '长协价（政策调控价）',
                    data: [],
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.3,
                    fill: true
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
                    intersect: false
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
    
    // 精度对比图
    const accuracyChartCtx = document.getElementById('accuracyChart').getContext('2d');
    window.accuracyChart = new Chart(accuracyChartCtx, {
        type: 'bar',
        data: {
            labels: ['日度', '月度', '年度'],
            datasets: [
                {
                    label: 'MAPE（%）',
                    data: [4.7, 3.9, 2.8],
                    backgroundColor: ['#3498db', '#2ecc71', '#e74c3c'],
                    borderColor: ['#2980b9', '#27ae60', '#c0392b'],
                    borderWidth: 1
                },
                {
                    label: 'RMSE',
                    data: [28.5, 24.3, 18.7],
                    backgroundColor: ['#3498db', '#2ecc71', '#e74c3c'],
                    borderColor: ['#2980b9', '#27ae60', '#c0392b'],
                    borderWidth: 1,
                    hidden: true
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
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.parsed.y.toFixed(1);
                            if (context.datasetIndex === 0) {
                                label += '%';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '误差指标'
                    }
                }
            }
        }
    });
}

// 加载初始数据
async function loadInitialData() {
    try {
        const dailyData = await window.coalPriceAPI.getPriceHistory('daily');
        updatePriceChart('daily', dailyData.data);
    } catch (error) {
        console.error('加载初始数据失败:', error);
    }
}

// 更新价格图表
function updatePriceChart(period, data = null) {
    if (!data) {
        // 如果没有提供数据，生成模拟数据
        data = generatePriceHistory(period);
    }
    
    window.priceChart.data.labels = data.labels;
    window.priceChart.data.datasets[0].data = data.marketPrices;
    window.priceChart.data.datasets[1].data = data.longTermPrices;
    window.priceChart.options.scales.x.title.text = period === 'daily' ? '日期' : period === 'monthly' ? '月份' : '年份';
    window.priceChart.update();
}

// 生成价格历史数据
function generatePriceHistory(period) {
    const baseMarketPrice = 800;
    const baseLongTermPrice = 750;
    const labels = [];
    const marketPrices = [];
    const longTermPrices = [];
    
    let count = 0;
    let startDate = new Date(2024, 0, 1);
    
    switch(period) {
        case 'daily':
            count = 30;
            for (let i = 0; i < count; i++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + i);
                labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
                
                const marketTrend = Math.sin(i * 0.2) * 20;
                const longTermTrend = Math.sin(i * 0.15) * 15;
                const random1 = (Math.random() - 0.5) * 10;
                const random2 = (Math.random() - 0.5) * 8;
                
                marketPrices.push(baseMarketPrice + marketTrend + random1);
                longTermPrices.push(baseLongTermPrice + longTermTrend * 0.8 + random2);
            }
            break;
            
        case 'monthly':
            count = 12;
            for (let i = 0; i < count; i++) {
                labels.push(`${2023}年${i + 1}月`);
                
                const trend = Math.sin(i * 0.5) * 40;
                const seasonal = i < 6 ? 20 : -10;
                const random1 = (Math.random() - 0.5) * 15;
                const random2 = (Math.random() - 0.5) * 12;
                
                marketPrices.push(baseMarketPrice + trend + seasonal + random1);
                longTermPrices.push(baseLongTermPrice + trend * 0.7 + seasonal * 0.6 + random2);
            }
            break;
            
        case 'yearly':
            count = 8;
            for (let i = 0; i < count; i++) {
                const year = 2017 + i;
                labels.push(`${year}年`);
                
                const trend = i * 25;
                const cycle = Math.sin(i * 0.8) * 30;
                const random1 = (Math.random() - 0.5) * 20;
                const random2 = (Math.random() - 0.5) * 15;
                
                marketPrices.push(baseMarketPrice + trend + cycle + random1);
                longTermPrices.push(baseLongTermPrice + trend * 0.85 + cycle * 0.7 + random2);
            }
            break;
    }
    
    return { labels, marketPrices, longTermPrices };
}

// 执行预测
async function performPrediction() {
    const params = getPredictionParams();
    
    // 显示加载指示器
    const loadingIndicator = document.getElementById('loadingIndicator');
    const predictionResult = document.getElementById('predictionResult');
    const predictionDetails = document.getElementById('predictionDetails');
    
    loadingIndicator.style.display = 'block';
    predictionResult.style.display = 'none';
    predictionDetails.style.display = 'none';
    
    try {
        const result = await window.coalPriceAPI.predictPrice(params);
        displayPredictionResult(params, result);
    } catch (error) {
        showError('预测失败: ' + error.message);
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

// 获取预测参数
function getPredictionParams() {
    const timeScale = document.getElementById('timeScale').value;
    const priceType = document.getElementById('priceType').value;
    const coalType = document.getElementById('coalType').value;
    const dateInput = document.getElementById('predictionDate').value;
    
    return {
        timeScale,
        priceType,
        coalType,
        date: dateInput
    };
}

// 生成预测结果
function generatePrediction(params) {
    const basePrices = {
        thermal: { market: 850, longterm: 780, benchmark: 820 },
        coking: { market: 950, longterm: 880, benchmark: 920 },
        anthracite: { market: 900, longterm: 830, benchmark: 870 }
    };
    
    const timeScaleFactors = {
        daily: 1.0,
        monthly: 1.05,
        yearly: 1.15
    };
    
    const basePrice = basePrices[params.coalType][params.priceType] || basePrices.thermal.market;
    const trend = (Math.random() - 0.5) * 20;
    const scaleFactor = timeScaleFactors[params.timeScale] || 1.0;
    
    return basePrice * scaleFactor + trend;
}

// 生成置信度
function generateConfidence(timeScale) {
    const confidences = {
        daily: 92.3,
        monthly: 94.7,
        yearly: 96.2
    };
    
    return confidences[timeScale] || 90.0;
}

// 生成价格范围
function generatePriceRange(timeScale) {
    const ranges = {
        daily: { min: -15, max: 15 },
        monthly: { min: -30, max: 30 },
        yearly: { min: -50, max: 50 }
    };
    
    return ranges[timeScale] || { min: -20, max: 20 };
}

// 生成影响因素
function generateInfluencingFactors(params) {
    const factors = [
        { name: '政策冲击指数', impact: (Math.random() * 3 + 1).toFixed(1) + '%', direction: Math.random() > 0.5 ? 'positive' : 'negative' },
        { name: '库存变化', impact: (Math.random() * 2 + 0.5).toFixed(1) + '%', direction: Math.random() > 0.5 ? 'positive' : 'negative' },
        { name: '季节性因素', impact: (Math.random() * 1.5 + 0.3).toFixed(1) + '%', direction: Math.random() > 0.5 ? 'positive' : 'negative' },
        { name: '气候影响', impact: (Math.random() * 1 + 0.2).toFixed(1) + '%', direction: Math.random() > 0.5 ? 'positive' : 'negative' },
        { name: '宏观经济', impact: (Math.random() * 2.5 + 0.5).toFixed(1) + '%', direction: Math.random() > 0.5 ? 'positive' : 'negative' }
    ];
    
    if (params.timeScale === 'yearly') {
        factors.push(
            { name: '产能规划调整', impact: (Math.random() * 4 + 1).toFixed(1) + '%', direction: Math.random() > 0.5 ? 'positive' : 'negative' },
            { name: '绿色转型影响', impact: (Math.random() * 2 + 0.5).toFixed(1) + '%', direction: Math.random() > 0.5 ? 'positive' : 'negative' }
        );
    }
    
    return factors;
}

// 显示预测结果
function displayPredictionResult(params, result) {
    const predictionResult = document.getElementById('predictionResult');
    const predictionDetails = document.getElementById('predictionDetails');
    
    // 更新预测结果
    document.getElementById('predictedPrice').textContent = result.prediction.toFixed(2);
    document.getElementById('confidenceLevel').textContent = result.confidence.toFixed(1) + '%';
    
    const priceRange = result.priceRange;
    const basePrice = result.prediction;
    document.getElementById('priceRange').textContent = 
        `${(basePrice + priceRange.min).toFixed(2)} - ${(basePrice + priceRange.max).toFixed(2)}`;
    
    // 更新影响因素
    const factorsContainer = document.getElementById('influencingFactors');
    factorsContainer.innerHTML = '';
    
    result.factors.forEach(factor => {
        const factorDiv = document.createElement('div');
        factorDiv.className = 'd-flex justify-content-between align-items-center mb-2 p-2 bg-light rounded';
        
        const directionIcon = factor.direction === 'positive' ? 
            '<i class="fas fa-arrow-up text-success me-1"></i>' : 
            '<i class="fas fa-arrow-down text-danger me-1"></i>';
        
        factorDiv.innerHTML = `
            <span>${factor.name}</span>
            <span class="badge ${factor.direction === 'positive' ? 'bg-success' : 'bg-danger'}">
                ${directionIcon} ${factor.impact}
            </span>
        `;
        
        factorsContainer.appendChild(factorDiv);
    });
    
    // 显示结果
    predictionResult.style.display = 'none';
    predictionDetails.style.display = 'block';
    
    // 添加预测建议
    addPredictionAdvice(params, result);
}

// 添加预测建议
function addPredictionAdvice(params, result) {
    const adviceContainer = document.getElementById('influencingFactors');
    
    const adviceDiv = document.createElement('div');
    adviceDiv.className = 'mt-3 p-3 bg-info bg-opacity-10 rounded border-start border-info border-3';
    
    let adviceText = '';
    const price = result.prediction;
    
    if (params.timeScale === 'daily') {
        adviceText = `短期操作建议（1-7天）：关注${price.toFixed(2)}元附近支撑位，建议在${(price - 5).toFixed(2)}-${(price + 5).toFixed(2)}元区间操作。`;
    } else if (params.timeScale === 'monthly') {
        const targetMin = price * 0.97;
        const targetMax = price * 1.03;
        adviceText = `中期策略建议（1-3个月）：目标区间${targetMin.toFixed(2)}-${targetMax.toFixed(2)}元，关注库存和政策变化。`;
    } else {
        const annualTrend = price > 850 ? '上升' : '调整';
        adviceText = `长期投资建议（6-12个月）：看好${annualTrend}趋势，重点关注产能规划和宏观政策，建议分批布局。`;
    }
    
    adviceDiv.innerHTML = `
        <h6><i class="fas fa-lightbulb me-2 text-warning"></i>操作建议</h6>
        <p class="mb-0">${adviceText}</p>
    `;
    
    adviceContainer.appendChild(adviceDiv);
}

// 显示错误
function showError(message) {
    const predictionResult = document.getElementById('predictionResult');
    predictionResult.innerHTML = `
        <div class="alert alert-danger">
            <i class="fas fa-exclamation-triangle me-2"></i>
            ${message}
        </div>
    `;
    predictionResult.style.display = 'block';
    
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'none';
}

// 时间尺度名称映射
function getTimeScaleName(key) {
    const names = {
        daily: '日度',
        monthly: '月度', 
        yearly: '年度'
    };
    return names[key] || key;
}

// 价格类型名称映射
function getPriceTypeName(key) {
    const names = {
        market: '市场价格',
        longterm: '长协价',
        benchmark: '基准价'
    };
    return names[key] || key;
}

// 煤炭类型名称映射
function getCoalTypeName(key) {
    const names = {
        thermal: '动力煤',
        coking: '炼焦煤',
        anthracite: '无烟煤'
    };
    return names[key] || key;
}