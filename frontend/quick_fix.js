/**
 * 双轨制系统快速修复脚本
 * 用于修复按钮无响应和API连接问题
 */

// 修复1: 确保API地址正确
if (typeof API_BASE_URL === 'undefined') {
    window.API_BASE_URL = 'https://spike.pythonanywhere.com/api';
    console.log('✅ 修复1: 已设置API_BASE_URL =', window.API_BASE_URL);
} else if (API_BASE_URL.includes('localhost:5002')) {
    window.API_BASE_URL = 'https://spike.pythonanywhere.com/api';
    console.log('✅ 修复1: 已更新API_BASE_URL =', window.API_BASE_URL);
}

// 修复2: 重新绑定双轨制分析按钮
function rebindDualTrackButton() {
    const dualTrackPredictBtn = document.getElementById('dualTrackPredictBtn');
    if (dualTrackPredictBtn) {
        // 移除所有现有的click事件监听器
        const newButton = dualTrackPredictBtn.cloneNode(true);
        dualTrackPredictBtn.parentNode.replaceChild(newButton, dualTrackPredictBtn);
        
        // 重新绑定事件
        newButton.addEventListener('click', function() {
            console.log('🚀 双轨制分析按钮被点击');
            
            // 如果performDualTrackAnalysis函数存在，调用它
            if (typeof window.performDualTrackAnalysis === 'function') {
                window.performDualTrackAnalysis();
            } else {
                // 备用方案：直接调用API
                console.log('⚠️  performDualTrackAnalysis函数未找到，使用备用方案');
                executeQuickDualTrackAnalysis();
            }
        });
        
        console.log('✅ 修复2: 双轨制分析按钮已重新绑定');
        return newButton;
    }
    return null;
}

// 修复3: 重新绑定开始预测按钮
function rebindPredictButton() {
    const predictBtn = document.getElementById('predictBtn');
    if (predictBtn) {
        // 移除所有现有的click事件监听器
        const newButton = predictBtn.cloneNode(true);
        predictBtn.parentNode.replaceChild(newButton, predictBtn);
        
        // 重新绑定事件
        newButton.addEventListener('click', function() {
            console.log('🚀 开始预测按钮被点击');
            
            // 如果performAPIPrediction函数存在，调用它
            if (typeof window.performAPIPrediction === 'function') {
                window.performAPIPrediction();
            } else {
                console.log('⚠️  performAPIPrediction函数未找到');
                alert('预测功能正在初始化，请稍后再试');
            }
        });
        
        console.log('✅ 修复3: 开始预测按钮已重新绑定');
        return newButton;
    }
    return null;
}

// 备用方案：执行快速双轨制分析
async function executeQuickDualTrackAnalysis() {
    try {
        console.log('🚀 执行快速双轨制分析...');
        
        // 显示加载指示器
        const resultElement = document.getElementById('dualTrackResult');
        if (resultElement) {
            resultElement.innerHTML = `
                <div class="text-center p-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">加载中...</span>
                    </div>
                    <p class="mt-2">正在执行双轨制分析...</p>
                </div>
            `;
        }
        
        // 调用API
        const response = await fetch(`${API_BASE_URL}/dual-track/quick`);
        const data = await response.json();
        
        console.log('✅ 快速分析结果:', data);
        
        // 更新界面
        if (data.success) {
            updateQuickAnalysisUI(data);
            alert(`分析成功！\n市场价格: ¥${data.market_price}\n计划价格: ¥${data.planned_price}\n建议: ${data.recommendation}`);
        } else {
            alert('分析失败: ' + (data.error || '未知错误'));
        }
        
    } catch (error) {
        console.error('❌ 分析失败:', error);
        alert('网络错误: ' + error.message);
    }
}

// 更新界面显示
function updateQuickAnalysisUI(data) {
    // 更新当前价格显示
    const marketPriceElement = document.getElementById('currentMarketPrice');
    const plannedPriceElement = document.getElementById('currentPlannedPrice');
    const priceDiffElement = document.getElementById('currentPriceDiff');
    const recommendationElement = document.getElementById('currentRecommendation');
    
    if (marketPriceElement) marketPriceElement.textContent = `${data.market_price.toFixed(2)} 元/吨`;
    if (plannedPriceElement) plannedPriceElement.textContent = `${data.planned_price.toFixed(2)} 元/吨`;
    if (priceDiffElement) {
        priceDiffElement.textContent = `${data.price_difference_pct.toFixed(1)}%`;
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
        if (data.recommendation.includes('卖出')) {
            recommendationElement.className = 'text-danger fw-bold';
        } else if (data.recommendation.includes('买入')) {
            recommendationElement.className = 'text-success fw-bold';
        } else {
            recommendationElement.className = 'text-warning fw-bold';
        }
    }
    
    console.log('✅ 界面已更新');
}

// 修复4: 测试API连接
async function testAPIConnection() {
    try {
        console.log('🔍 测试API连接...');
        const response = await fetch(`${API_BASE_URL}/status`);
        const data = await response.json();
        
        console.log('✅ API连接成功:', data);
        
        // 更新状态显示
        const statusElement = document.getElementById('apiStatus');
        if (statusElement) {
            statusElement.innerHTML = `<span class="text-success">✅ 已连接 (${data.status})</span>`;
        }
        
        const modeElement = document.getElementById('apiMode');
        if (modeElement) {
            modeElement.textContent = data.mode === 'simulation' ? '模拟模式' : '实时模式';
        }
        
        const responseTimeElement = document.getElementById('apiResponseTime');
        if (responseTimeElement) {
            responseTimeElement.textContent = new Date().toLocaleTimeString();
        }
        
        return true;
    } catch (error) {
        console.error('❌ API连接失败:', error);
        
        const statusElement = document.getElementById('apiStatus');
        if (statusElement) {
            statusElement.innerHTML = `<span class="text-danger">❌ 连接失败: ${error.message}</span>`;
        }
        
        return false;
    }
}

// 修复5: 加载快速分析数据
async function loadQuickAnalysisData() {
    try {
        console.log('📥 加载快速分析数据...');
        const response = await fetch(`${API_BASE_URL}/dual-track/quick`);
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ 快速分析数据加载成功');
            updateQuickAnalysisUI(data);
            return data;
        }
    } catch (error) {
        console.error('❌ 加载快速分析数据失败:', error);
    }
    return null;
}

// 主修复函数
function applyAllFixes() {
    console.log('🔧 开始应用所有修复...');
    
    // 应用修复
    rebindDualTrackButton();
    rebindPredictButton();
    
    // 测试API连接
    testAPIConnection().then(success => {
        if (success) {
            // 加载数据
            setTimeout(() => loadQuickAnalysisData(), 1000);
        }
    });
    
    console.log('✅ 所有修复已应用');
    
    // 显示修复完成提示
    setTimeout(() => {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed bottom-0 end-0 m-3';
        alertDiv.style.zIndex = '9999';
        alertDiv.style.maxWidth = '300px';
        alertDiv.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            <strong>✅ 快速修复已应用</strong>
            <p class="mb-0 small mt-1">按钮功能和API连接已修复</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);
    }, 1000);
}

// 页面加载完成后自动应用修复
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAllFixes);
} else {
    applyAllFixes();
}

// 提供全局函数供手动调用
window.quickFix = {
    applyAllFixes,
    rebindDualTrackButton,
    rebindPredictButton,
    testAPIConnection,
    loadQuickAnalysisData,
    executeQuickDualTrackAnalysis
};

console.log('🚀 快速修复脚本已加载');
console.log('💡 手动调用: window.quickFix.applyAllFixes()');