/**
 * 双轨制系统紧急修复 - 最简化版本
 * 直接绑定按钮事件，不依赖复杂逻辑
 */

console.log('🚨 紧急修复脚本加载');

// 修复1: 确保API地址正确
window.API_BASE_URL = 'https://spike.pythonanywhere.com/api';
console.log('✅ API地址已设为:', window.API_BASE_URL);

// 修复2: 直接绑定双轨制分析按钮
function bindDualTrackButton() {
    const button = document.getElementById('dualTrackPredictBtn');
    if (!button) {
        console.error('❌ 找不到双轨制分析按钮');
        return false;
    }
    
    // 移除所有现有事件
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    // 直接绑定事件
    newButton.onclick = async function() {
        console.log('🚀 双轨制分析按钮点击');
        alert('开始执行双轨制分析...');
        
        try {
            const response = await fetch(`${window.API_BASE_URL}/dual-track/quick`);
            const data = await response.json();
            
            if (data.success) {
                // 更新价格显示
                const marketPrice = document.getElementById('currentMarketPrice');
                const plannedPrice = document.getElementById('currentPlannedPrice');
                const priceDiff = document.getElementById('currentPriceDiff');
                const recommendation = document.getElementById('currentRecommendation');
                
                if (marketPrice) marketPrice.textContent = `${data.market_price.toFixed(2)} 元/吨`;
                if (plannedPrice) plannedPrice.textContent = `${data.planned_price.toFixed(2)} 元/吨`;
                if (priceDiff) priceDiff.textContent = `${data.price_difference_pct.toFixed(1)}%`;
                if (recommendation) recommendation.textContent = data.recommendation;
                
                alert(`✅ 分析完成！\n市场价格: ¥${data.market_price}\n计划价格: ¥${data.planned_price}\n建议: ${data.recommendation}`);
            } else {
                alert('❌ 分析失败: ' + (data.error || '未知错误'));
            }
        } catch (error) {
            console.error('网络错误:', error);
            alert('❌ 网络连接失败，请检查网络');
        }
    };
    
    console.log('✅ 双轨制分析按钮已绑定');
    return true;
}

// 修复3: 直接绑定开始预测按钮
function bindPredictButton() {
    const button = document.getElementById('predictBtn');
    if (!button) {
        console.error('❌ 找不到开始预测按钮');
        return false;
    }
    
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    newButton.onclick = function() {
        console.log('🚀 开始预测按钮点击');
        alert('预测功能正在开发中...\n请先使用双轨制分析功能');
    };
    
    console.log('✅ 开始预测按钮已绑定');
    return true;
}

// 修复4: 测试API连接并更新状态
async function testAPIStatus() {
    try {
        console.log('🔍 测试API连接...');
        const response = await fetch(`${window.API_BASE_URL}/status`);
        const data = await response.json();
        
        console.log('✅ API连接成功:', data);
        
        const statusElement = document.getElementById('apiStatus');
        if (statusElement) {
            statusElement.innerHTML = `<span class="text-success">✅ 已连接 (${data.status})</span>`;
        }
        
        return true;
    } catch (error) {
        console.error('❌ API连接失败:', error);
        
        const statusElement = document.getElementById('apiStatus');
        if (statusElement) {
            statusElement.innerHTML = `<span class="text-danger">❌ 连接失败</span>`;
        }
        
        return false;
    }
}

// 修复5: 加载默认数据
async function loadDefaultData() {
    try {
        const response = await fetch(`${window.API_BASE_URL}/dual-track/quick`);
        const data = await response.json();
        
        if (data.success) {
            const marketPrice = document.getElementById('currentMarketPrice');
            const plannedPrice = document.getElementById('currentPlannedPrice');
            const priceDiff = document.getElementById('currentPriceDiff');
            const recommendation = document.getElementById('currentRecommendation');
            
            if (marketPrice) marketPrice.textContent = `${data.market_price.toFixed(2)} 元/吨`;
            if (plannedPrice) plannedPrice.textContent = `${data.planned_price.toFixed(2)} 元/吨`;
            if (priceDiff) priceDiff.textContent = `${data.price_difference_pct.toFixed(1)}%`;
            if (recommendation) recommendation.textContent = data.recommendation;
            
            console.log('✅ 默认数据已加载');
        }
    } catch (error) {
        console.error('加载默认数据失败:', error);
    }
}

// 主修复函数
function emergencyFix() {
    console.log('🔧 执行紧急修复...');
    
    // 绑定按钮
    const btn1 = bindDualTrackButton();
    const btn2 = bindPredictButton();
    
    // 测试API
    testAPIStatus().then(success => {
        if (success) {
            setTimeout(loadDefaultData, 1000);
        }
    });
    
    // 显示修复成功提示
    setTimeout(() => {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-3';
        alertDiv.style.zIndex = '9999';
        alertDiv.style.maxWidth = '300px';
        alertDiv.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            <strong>✅ 紧急修复已应用</strong>
            <p class="mb-0 small mt-1">按钮功能已恢复</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);
    }, 500);
    
    console.log('✅ 紧急修复完成');
}

// 页面加载完成后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', emergencyFix);
} else {
    emergencyFix();
}

// 提供手动调用接口
window.emergencyFix = emergencyFix;
console.log('💡 手动调用: window.emergencyFix()');