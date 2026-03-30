// 双轨制分析增强功能 - 为新网站集成添加

// API基础地址 - 与主文件保持一致
const API_BASE_URL = 'https://spike.pythonanywhere.com/api';

// 检查API状态并更新状态面板
async function checkAPIStatus() {
    try {
        console.log('🔍 检查API服务器状态...');
        const response = await fetch(`${API_BASE_URL}/status`);
        const data = await response.json();
        
        console.log('✅ API服务器状态:', data);
        
        // 更新状态面板
        const statusElement = document.getElementById('apiStatus');
        const modeElement = document.getElementById('apiMode');
        const responseTimeElement = document.getElementById('apiResponseTime');
        
        if (statusElement) {
            statusElement.innerHTML = `<span class="text-success">✅ 已连接 (${data.status})</span>`;
        }
        
        if (modeElement) {
            modeElement.textContent = data.mode === 'simulation' ? '模拟模式' : '实时模式';
        }
        
        if (responseTimeElement) {
            responseTimeElement.textContent = new Date().toLocaleTimeString();
        }
        
        // 自动加载快速分析数据
        loadQuickAnalysis();
        
        return data;
        
    } catch (error) {
        console.error('❌ 无法连接到API服务器:', error);
        
        // 更新状态面板为错误状态
        const statusElement = document.getElementById('apiStatus');
        if (statusElement) {
            statusElement.innerHTML = `<span class="text-danger">❌ 连接失败</span>`;
        }
        
        return null;
    }
}

// 加载快速分析数据
async function loadQuickAnalysis() {
    try {
        console.log('🚀 加载快速分析数据...');
        const response = await fetch(`${API_BASE_URL}/dual-track/quick`);
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ 快速分析数据加载完成:', data);
            
            // 更新实时数据面板
            updateCurrentMarketData(data);
            updateQuickAnalysisUI(data);
            
            return data;
        }
        
    } catch (error) {
        console.error('❌ 加载快速分析失败:', error);
        return null;
    }
}

// 更新当前市场数据
function updateCurrentMarketData(data) {
    try {
        const marketPriceElement = document.getElementById('currentMarketPrice');
        const plannedPriceElement = document.getElementById('currentPlannedPrice');
        const priceDiffElement = document.getElementById('currentPriceDiff');
        const recommendationElement = document.getElementById('currentRecommendation');
        
        if (marketPriceElement) {
            marketPriceElement.textContent = `${data.market_price.toFixed(2)} 元/吨`;
        }
        
        if (plannedPriceElement) {
            plannedPriceElement.textContent = `${data.planned_price.toFixed(2)} 元/吨`;
        }
        
        if (priceDiffElement) {
            priceDiffElement.textContent = `${data.price_difference_pct.toFixed(1)}%`;
            
            // 根据价差设置颜色
            if (data.price_difference_pct > 12) {
                priceDiffElement.className = 'text-danger';
            } else if (data.price_difference_pct > 8) {
                priceDiffElement.className = 'text-warning';
            } else if (data.price_difference_pct < 4) {
                priceDiffElement.className = 'text-success';
            } else {
                priceDiffElement.className = 'text-info';
            }
        }
        
        if (recommendationElement) {
            recommendationElement.textContent = data.recommendation;
            
            // 根据建议设置颜色
            if (data.recommendation.includes('卖出')) {
                recommendationElement.className = 'text-danger fw-bold';
            } else if (data.recommendation.includes('买入')) {
                recommendationElement.className = 'text-success fw-bold';
            } else {
                recommendationElement.className = 'text-warning fw-bold';
            }
        }
        
    } catch (error) {
        console.error('❌ 更新市场数据失败:', error);
    }
}

// 执行双轨制分析
async function performDualTrackAnalysis() {
    // 获取参数
    const coalType = document.getElementById('coalType').value;
    const basePrice = parseFloat(document.getElementById('basePrice').value);
    const daysBack = parseInt(document.getElementById('daysBack').value);
    const predictionType = document.getElementById('predictionType').value;
    
    console.log('🚀 执行双轨制分析:', { coalType, basePrice, daysBack, predictionType });
    
    // 显示加载指示器
    showDualTrackLoading(true);
    
    try {
        let data;
        
        if (predictionType === 'quick') {
            // 快速分析
            const response = await fetch(`${API_BASE_URL}/dual-track/quick`);
            data = await response.json();
        } else {
            // 完整分析
            const response = await fetch(`${API_BASE_URL}/dual-track/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    base_price: basePrice,
                    days_back: daysBack,
                    coal_type: coalType
                })
            });
            data = await response.json();
        }
        
        if (data.success) {
            console.log('✅ 双轨制分析成功:', data);
            displayDualTrackResult(data, predictionType === 'full');
        } else {
            console.error('❌ 双轨制分析失败:', data.error);
            showDualTrackError('分析失败: ' + (data.error || '未知错误'));
        }
        
    } catch (error) {
        console.error('❌ 双轨制分析请求失败:', error);
        showDualTrackError('网络错误: ' + error.message);
    } finally {
        showDualTrackLoading(false);
    }
}

// 显示双轨制加载状态
function showDualTrackLoading(show) {
    const loadingElement = document.getElementById('dualTrackLoading');
    const resultElement = document.getElementById('dualTrackResult');
    const detailsElement = document.getElementById('dualTrackDetails');
    
    if (loadingElement) {
        loadingElement.style.display = show ? 'block' : 'none';
    }
    
    if (resultElement && !show) {
        resultElement.style.display = 'none';
    }
    
    if (detailsElement && !show) {
        detailsElement.style.display = 'block';
    }
}

// 显示双轨制分析结果
function displayDualTrackResult(data, isFullAnalysis = false) {
    console.log('📊 显示双轨制分析结果:', data);
    
    // 更新价格显示
    const marketPriceElement = document.getElementById('predictedMarketPrice');
    const plannedPriceElement = document.getElementById('predictedPlannedPrice');
    const priceDiffElement = document.getElementById('predictedPriceDiff');
    
    if (marketPriceElement) {
        marketPriceElement.textContent = data.market_price?.toFixed(2) || data.price_results?.market_price?.toFixed(2) || '0.00';
    }
    
    if (plannedPriceElement) {
        plannedPriceElement.textContent = data.planned_price?.toFixed(2) || data.price_results?.planned_price?.toFixed(2) || '0.00';
    }
    
    if (priceDiffElement) {
        const priceDiffPct = data.price_difference_pct || data.price_results?.price_difference_pct || 0;
        priceDiffElement.textContent = `${priceDiffPct.toFixed(1)}%`;
        
        // 根据价差设置颜色
        if (priceDiffPct > 12) {
            priceDiffElement.className = 'text-danger';
        } else if (priceDiffPct > 8) {
            priceDiffElement.className = 'text-warning';
        } else if (priceDiffPct < 4) {
            priceDiffElement.className = 'text-success';
        } else {
            priceDiffElement.className = 'text-info';
        }
    }
    
    // 更新交易建议
    updateDualTrackRecommendation(data);
    
    // 更新市场趋势
    updateDualTrackTrends(data);
    
    // 如果是完整分析，显示详细报告
    if (isFullAnalysis) {
        displayFullAnalysisReport(data);
    }
}

// 更新双轨制交易建议
function updateDualTrackRecommendation(data) {
    const actionElement = document.getElementById('recommendationAction');
    const reasonElement = document.getElementById('recommendationReason');
    const confidenceElement = document.getElementById('recommendationConfidence');
    const riskElement = document.getElementById('recommendationRisk');
    
    // 获取建议数据（兼容不同API响应格式）
    const recommendation = data.recommendation || {};
    const action = recommendation.action || data.recommendation || '观望';
    const reason = recommendation.reason || '市场表现稳定';
    const confidence = recommendation.confidence || data.confidence || 0.6;
    const riskLevel = recommendation.risk_level || data.risk_level || '中等';
    
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
    
    if (reasonElement) {
        reasonElement.textContent = reason;
    }
    
    if (confidenceElement) {
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
    
    if (riskElement) {
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

// 更新双轨制市场趋势
function updateDualTrackTrends(data) {
    const futuresTrendElement = document.getElementById('futuresTrend');
    const inventoryTrendElement = document.getElementById('inventoryTrend');
    const compositeScoreElement = document.getElementById('compositeScore');
    
    // 获取趋势数据（兼容不同API响应格式）
    const analysis = data.price_results?.base_analysis || data.analysis || {};
    const futuresTrend = analysis.futures_trend || data.futures_trend || 'flat';
    const inventoryTrend = analysis.inventory_trend || 'stable';
    const compositeScore = analysis.composite_score || data.composite_score || 0.5;
    
    if (futuresTrendElement) {
        futuresTrendElement.textContent = formatTrendText(futuresTrend);
        futuresTrendElement.className = getTrendColorClass(futuresTrend);
    }
    
    if (inventoryTrendElement) {
        inventoryTrendElement.textContent = formatTrendText(inventoryTrend);
        inventoryTrendElement.className = getTrendColorClass(inventoryTrend);
    }
    
    if (compositeScoreElement) {
        compositeScoreElement.textContent = compositeScore.toFixed(2);
        
        // 根据综合评分设置颜色
        if (compositeScore >= 0.7) {
            compositeScoreElement.className = 'text-success fw-bold';
        } else if (compositeScore >= 0.6) {
            compositeScoreElement.className = 'text-warning fw-bold';
        } else if (compositeScore >= 0.4) {
            compositeScoreElement.className = 'text-info fw-bold';
        } else {
            compositeScoreElement.className = 'text-danger fw-bold';
        }
    }
}

// 格式化趋势文本
function formatTrendText(trend) {
    const trendMap = {
        'up': '上涨 📈',
        'down': '下跌 📉',
        'flat': '震荡 ➡️',
        'stable': '稳定 ⚖️'
    };
    
    return trendMap[trend] || trend;
}

// 获取趋势颜色类
function getTrendColorClass(trend) {
    const colorMap = {
        'up': 'text-success',
        'down': 'text-danger',
        'flat': 'text-warning',
        'stable': 'text-info'
    };
    
    return colorMap[trend] || 'text-muted';
}

// 显示完整分析报告
function displayFullAnalysisReport(data) {
    const reportElement = document.getElementById('analysisReport');
    if (!reportElement) return;
    
    const priceResults = data.price_results || {};
    const recommendation = data.recommendation || {};
    const dataSummary = data.data_summary || {};
    const fusedFeatures = priceResults.fused_features_summary || {};
    
    let html = `
        <div class="mb-3">
            <h6><i class="fas fa-chart-line me-2"></i>价格分析详情</h6>
            <div class="row">
                <div class="col-md-6">
                    <small class="text-muted">市场价格调节系数</small>
                    <p class="mb-1">${(priceResults.market_adjustment || 1.0).toFixed(3)}</p>
                </div>
                <div class="col-md-6">
                    <small class="text-muted">计划价格调节系数</small>
                    <p class="mb-1">${(priceResults.planned_adjustment || 0.85).toFixed(3)}</p>
                </div>
            </div>
        </div>
        
        <div class="mb-3">
            <h6><i class="fas fa-database me-2"></i>数据统计</h6>
            <div class="row">
                <div class="col-md-4">
                    <small class="text-muted">期货数据量</small>
                    <p class="mb-1">${dataSummary.futures_data_count || 0} 条</p>
                </div>
                <div class="col-md-4">
                    <small class="text-muted">库存数据量</small>
                    <p class="mb-1">${dataSummary.inventory_data_count || 0} 条</p>
                </div>
                <div class="col-md-4">
                    <small class="text-muted">特征数量</small>
                    <p class="mb-1">${dataSummary.feature_count || 0} 个</p>
                </div>
            </div>
        </div>
        
        <div class="mb-3">
            <h6><i class="fas fa-cogs me-2"></i>融合特征分析</h6>
            <div class="row">
                <div class="col-md-6">
                    <small class="text-muted">政策平均强度</small>
                    <p class="mb-1">${(fusedFeatures.policy_avg_intensity || 0).toFixed(2)}</p>
                </div>
                <div class="col-md-6">
                    <small class="text-muted">舆情平均得分</small>
                    <p class="mb-1">${(fusedFeatures.sentiment_avg || 0).toFixed(2)}</p>
                </div>
            </div>
        </div>
        
        <div class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>
            <strong>分析说明：</strong> 系统基于双轨制定价体系，综合考虑市场供需、政策调控、库存水平和舆情影响等多维度因素进行价格预测。
        </div>
    `;
    
    reportElement.innerHTML = html;
}

// 显示双轨制错误
function showDualTrackError(message) {
    const resultElement = document.getElementById('dualTrackResult');
    if (!resultElement) return;
    
    resultElement.innerHTML = `
        <div class="alert alert-danger">
            <i class="fas fa-exclamation-triangle me-2"></i>
            <strong>分析错误</strong>
            <p class="mb-0 mt-1">${message}</p>
            <button class="btn btn-sm btn-outline-danger mt-2" onclick="performDualTrackAnalysis()">
                <i class="fas fa-redo me-1"></i>重试
            </button>
        </div>
    `;
    
    // 隐藏详情面板
    const detailsElement = document.getElementById('dualTrackDetails');
    if (detailsElement) {
        detailsElement.style.display = 'none';
    }
    
    // 显示结果面板
    resultElement.style.display = 'block';
}

// 加载价格历史
async function loadPriceHistory() {
    try {
        console.log('📊 加载价格历史数据...');
        const response = await fetch(`${API_BASE_URL}/price/history?period=daily&days=30`);
        const data = await response.json();
        
        if (data.success && data.prices) {
            console.log('✅ 价格历史数据加载完成');
            updateDualTrackPriceChart(data.prices);
        }
        
    } catch (error) {
        console.error('❌ 加载价格历史失败:', error);
    }
}

// 更新双轨制价格图表
function updateDualTrackPriceChart(prices) {
    const chartCtx = document.getElementById('dualTrackPriceChart');
    if (!chartCtx) {
        console.log('⚠️ 未找到双轨制价格图表元素');
        return;
    }
    
    // 如果图表已存在，销毁它
    if (window.dualTrackChart) {
        window.dualTrackChart.destroy();
    }
    
    // 创建新图表
    window.dualTrackChart = new Chart(chartCtx.getContext('2d'), {
        type: 'line',
        data: {
            labels: prices.labels || [],
            datasets: [
                {
                    label: '市场价格',
                    data: prices.market || [],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.3,
                    fill: true,
                    borderWidth: 2
                },
                {
                    label: '计划价格',
                    data: prices.planned || [],
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
    
    console.log('📈 双轨制价格图表已更新');
}

// 初始化双轨制图表
function initializeDualTrackCharts() {
    // 初始化双轨制价格图表
    const chartCtx = document.getElementById('dualTrackPriceChart');
    if (chartCtx) {
        window.dualTrackChart = new Chart(chartCtx.getContext('2d'), {
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
        
        console.log('📊 双轨制价格图表初始化完成');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔗 双轨制分析增强模块加载');
    
    // 初始化双轨制图表
    initializeDualTrackCharts();
    
    // 检查API状态
    checkAPIStatus();
    
    // 加载价格历史数据
    loadPriceHistory();
});