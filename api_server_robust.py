#!/usr/bin/env python3
"""
煤炭双轨制价格预测系统 - 稳健版API服务器
使用非调试模式，避免重载器问题，专门为网站集成设计
"""

import sys
import os
import json
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import warnings
warnings.filterwarnings('ignore')

# 添加系统路径
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'coal_price_prediction_system'))

# 尝试导入双轨制系统（但设置不使用网络爬虫的模拟模式）
print("🚀 启动稳健版API服务器...")
print("🔧 配置: 使用轻量级模式，避免网络依赖")

# 系统状态
SYSTEM_AVAILABLE = False  # 默认使用模拟模式，避免卡住
system_initialized = False
dual_track_system = None

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)  # 允许跨域请求

class MockDualTrackSystem:
    """模拟双轨制系统，避免网络请求导致的卡死问题"""
    
    def __init__(self):
        self.dual_track_params = {
            'market_weight': 0.65,
            'planned_weight': 0.35,
            'policy_impact': 0.20,
            'sentiment_impact': 0.15,
            'inventory_impact': 0.25,
            'futures_impact': 0.40
        }
        print("✅ 模拟双轨制系统初始化完成")
    
    def collect_all_data(self, days_back=30):
        """模拟数据收集，不进行网络请求"""
        print(f"📊 模拟数据收集 ({days_back}天，无网络请求)...")
        
        # 生成模拟数据
        return {
            'futures': [],
            'stocks': [],
            'port_inventory': [],
            'policy_sentiment': {},
            'fused_features': {
                'policy_avg_intensity': 0.3 + (datetime.now().day % 10) * 0.05,
                'sentiment_avg': 0.2 + (datetime.now().day % 7) * 0.03,
                'policy_count': 15,
                'sentiment_count': 42
            }
        }
    
    def calculate_dual_track_prices(self, all_data, base_price=750.0):
        """模拟价格计算"""
        print(f"💰 模拟价格计算 (基础价: {base_price})...")
        
        # 模拟分析
        analysis = {
            'futures_trend': ['up', 'down', 'flat'][datetime.now().day % 3],
            'stocks_trend': ['up', 'down', 'flat'][(datetime.now().day + 1) % 3],
            'inventory_trend': ['up', 'down', 'stable'][(datetime.now().day + 2) % 3],
            'composite_score': 0.5 + (datetime.now().day % 10) * 0.02,
            'inventory_level': 350 + (datetime.now().day % 10) * 20
        }
        
        fused_features = all_data.get('fused_features', {})
        
        # 模拟价格计算
        market_price = base_price
        planned_price = base_price * 0.85
        
        # 市场价调整
        market_adjustment = 1.0
        
        if analysis['futures_trend'] == 'up':
            market_adjustment *= 1.05
        elif analysis['futures_trend'] == 'down':
            market_adjustment *= 0.95
        
        # 库存影响
        if analysis['inventory_level'] > 500:
            market_adjustment *= 0.97
        elif analysis['inventory_level'] < 300:
            market_adjustment *= 1.03
        
        # 政策影响
        if 'policy_avg_intensity' in fused_features:
            policy_impact = 1.0 + (fused_features['policy_avg_intensity'] * 0.2)
            market_adjustment *= policy_impact
        
        # 舆情影响
        if 'sentiment_avg' in fused_features:
            sentiment_impact = 1.0 + (fused_features['sentiment_avg'] * 0.15)
            market_adjustment *= sentiment_impact
        
        market_price *= market_adjustment
        
        # 计划价调整
        planned_adjustment = 1.0 + ((market_adjustment - 1.0) * 0.6)
        
        if 'policy_avg_intensity' in fused_features:
            policy_planned_impact = 1.0 - (fused_features['policy_avg_intensity'] * 0.15)
            planned_adjustment *= policy_planned_impact
        
        if analysis['inventory_level'] > 450:
            planned_adjustment *= 0.95
        
        planned_price *= planned_adjustment
        
        # 确保计划价不超过市场价的90%
        if planned_price > market_price * 0.90:
            planned_price = market_price * 0.90
        
        # 计算价差
        price_diff = market_price - planned_price
        price_diff_pct = (price_diff / planned_price) * 100
        
        return {
            'market_price': round(market_price, 2),
            'planned_price': round(planned_price, 2),
            'price_difference': round(price_diff, 2),
            'price_difference_pct': round(price_diff_pct, 1),
            'market_adjustment': round(market_adjustment, 3),
            'planned_adjustment': round(planned_adjustment, 3),
            'base_analysis': analysis,
            'fused_features_summary': fused_features
        }
    
    def generate_trading_recommendation(self, price_results, all_data):
        """模拟交易建议"""
        print("💡 模拟交易建议...")
        
        price_diff_pct = price_results['price_difference_pct']
        
        recommendation = {
            'action': '观望',
            'reason': '',
            'confidence': 0.5,
            'risk_level': '中等'
        }
        
        # 基于价差的建议
        if price_diff_pct > 12:
            recommendation['action'] = '卖出套利'
            recommendation['reason'] = '市场价显著高于计划价，存在套利机会'
            recommendation['confidence'] = 0.7
            recommendation['risk_level'] = '低'
        elif price_diff_pct > 8:
            recommendation['action'] = '考虑卖出'
            recommendation['reason'] = '市场价高于计划价，价差较大'
            recommendation['confidence'] = 0.6
            recommendation['risk_level'] = '中低'
        elif price_diff_pct < 4:
            recommendation['action'] = '考虑买入'
            recommendation['reason'] = '市场价接近计划价，价差较小'
            recommendation['confidence'] = 0.55
            recommendation['risk_level'] = '中'
        
        # 基于模拟特征调整
        fused_features = all_data.get('fused_features', {})
        
        if 'sentiment_avg' in fused_features and fused_features['sentiment_avg'] > 0.3:
            recommendation['confidence'] = min(0.8, recommendation['confidence'] + 0.1)
        
        if 'policy_avg_intensity' in fused_features and fused_features['policy_avg_intensity'] > 0.6:
            recommendation['risk_level'] = '较高'
        
        return recommendation

def initialize_system():
    """初始化系统（稳健版，只使用模拟数据）"""
    global dual_track_system, system_initialized
    
    if system_initialized:
        return dual_track_system
    
    print("🔄 初始化稳健版系统...")
    dual_track_system = MockDualTrackSystem()
    system_initialized = True
    return dual_track_system

# API路由
@app.route('/')
def serve_index():
    """提供主页"""
    return send_from_directory('.', 'index.html')

@app.route('/api/status', methods=['GET'])
def get_status():
    """获取系统状态"""
    return jsonify({
        'status': 'online',
        'system_available': SYSTEM_AVAILABLE,
        'system_initialized': system_initialized,
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0',
        'description': '中国煤炭双轨制定价价格预测系统API（稳健版）',
        'mode': 'simulation',
        'note': '使用模拟数据模式，避免网络请求导致的卡死问题'
    })

@app.route('/api/dual-track/analyze', methods=['POST'])
def analyze_dual_track():
    """执行双轨制价格分析（稳健版）"""
    try:
        data = request.json or {}
        days_back = data.get('days_back', 7)
        base_price = data.get('base_price', 750.0)
        
        print(f"📊 API请求: 双轨制分析 (days_back={days_back}, base_price={base_price})")
        
        # 获取系统
        system = initialize_system()
        
        # 收集数据（模拟）
        all_data = system.collect_all_data(days_back=days_back)
        
        # 计算价格
        price_results = system.calculate_dual_track_prices(all_data, base_price=base_price)
        
        # 生成建议
        recommendation = system.generate_trading_recommendation(price_results, all_data)
        
        # 准备响应
        response = {
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'parameters': {
                'days_back': days_back,
                'base_price': base_price
            },
            'price_results': price_results,
            'recommendation': recommendation,
            'data_summary': {
                'futures_data_count': len(all_data.get('futures', [])),
                'inventory_data_count': len(all_data.get('port_inventory', [])),
                'feature_count': len(all_data.get('fused_features', {}))
            },
            'mode': 'simulation',
            'performance': 'immediate'
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"❌ API错误: {e}")
        import traceback
        traceback.print_exc()
        
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/dual-track/quick', methods=['GET'])
def quick_dual_track():
    """快速双轨制价格分析（使用默认参数）"""
    try:
        print("🚀 API请求: 快速双轨制分析")
        
        # 获取系统
        system = initialize_system()
        
        # 收集数据（较短的日期范围）
        all_data = system.collect_all_data(days_back=3)
        
        # 计算价格
        price_results = system.calculate_dual_track_prices(all_data, base_price=750.0)
        
        # 生成建议
        recommendation = system.generate_trading_recommendation(price_results, all_data)
        
        # 简化响应
        response = {
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'market_price': price_results['market_price'],
            'planned_price': price_results['planned_price'],
            'price_difference': price_results['price_difference'],
            'price_difference_pct': price_results['price_difference_pct'],
            'recommendation': recommendation['action'],
            'confidence': recommendation['confidence'],
            'risk_level': recommendation['risk_level'],
            'futures_trend': price_results['base_analysis'].get('futures_trend', 'unknown'),
            'composite_score': price_results['base_analysis'].get('composite_score', 0.5),
            'mode': 'simulation',
            'performance': 'immediate'
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"❌ API错误: {e}")
        
        # 返回模拟数据作为后备
        return jsonify({
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'market_price': 826.0 + (datetime.now().day % 10) * 3.5,
            'planned_price': 764.86 + (datetime.now().day % 10) * 2.8,
            'price_difference': 61.14 + (datetime.now().day % 10) * 0.7,
            'price_difference_pct': 8.0 + (datetime.now().day % 10) * 0.2,
            'recommendation': ['观望', '考虑买入', '考虑卖出'][datetime.now().day % 3],
            'confidence': 0.6 + (datetime.now().day % 10) * 0.02,
            'risk_level': '中等',
            'futures_trend': ['up', 'down', 'flat'][datetime.now().day % 3],
            'composite_score': 0.5 + (datetime.now().day % 10) * 0.02,
            'mode': 'simulation',
            'note': '使用模拟数据（稳健版API服务器）'
        })

@app.route('/api/market/trend', methods=['GET'])
def get_market_trend():
    """获取市场趋势分析"""
    try:
        print("📈 API请求: 市场趋势分析")
        
        # 模拟分析
        analysis = {
            'futures_trend': ['up', 'down', 'flat'][datetime.now().day % 3],
            'stocks_trend': ['up', 'down', 'flat'][(datetime.now().day + 1) % 3],
            'inventory_trend': ['up', 'down', 'stable'][(datetime.now().day + 2) % 3],
            'composite_score': 0.5 + (datetime.now().day % 10) * 0.02,
            'inventory_level': 350 + (datetime.now().day % 10) * 20,
            'market_sentiment': ['bullish', 'bearish', 'neutral'][datetime.now().day % 3]
        }
        
        return jsonify({
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'analysis': analysis,
            'mode': 'simulation'
        })
        
    except Exception as e:
        print(f"❌ API错误: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/price/history', methods=['GET'])
def get_price_history():
    """获取价格历史数据"""
    try:
        period = request.args.get('period', 'daily')
        days = int(request.args.get('days', 30))
        
        print(f"📊 API请求: 价格历史 (period={period}, days={days})")
        
        # 生成模拟价格历史
        prices = generate_price_history(period, days)
        
        return jsonify({
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'period': period,
            'days': days,
            'prices': prices,
            'mode': 'simulation'
        })
        
    except Exception as e:
        print(f"❌ API错误: {e}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/system/info', methods=['GET'])
def get_system_info():
    """获取系统信息"""
    system = initialize_system()
    
    return jsonify({
        'success': True,
        'timestamp': datetime.now().isoformat(),
        'system': {
            'name': '中国煤炭双轨制定价价格预测系统（稳健版）',
            'version': '2.0.0',
            'mode': 'SIMULATION',
            'dual_track_params': system.dual_track_params if hasattr(system, 'dual_track_params') else {},
            'initialized': system_initialized,
            'performance': '实时模拟，无网络延迟'
        },
        'api': {
            'endpoints': [
                {'path': '/api/status', 'method': 'GET', 'description': '系统状态'},
                {'path': '/api/dual-track/analyze', 'method': 'POST', 'description': '双轨制分析'},
                {'path': '/api/dual-track/quick', 'method': 'GET', 'description': '快速分析'},
                {'path': '/api/market/trend', 'method': 'GET', 'description': '市场趋势'},
                {'path': '/api/price/history', 'method': 'GET', 'description': '价格历史'},
                {'path': '/api/system/info', 'method': 'GET', 'description': '系统信息'}
            ]
        }
    })

def generate_price_history(period='daily', days=30):
    """生成模拟价格历史数据"""
    import math
    import random
    
    base_market = 826.0
    base_planned = 764.86
    base_benchmark = 795.4
    
    labels = []
    market_prices = []
    planned_prices = []
    benchmark_prices = []
    
    start_date = datetime.now() - timedelta(days=days)
    
    for i in range(days):
        date = start_date + timedelta(days=i)
        
        if period == 'daily':
            labels.append(date.strftime('%m/%d'))
        elif period == 'monthly':
            if date.day == 1:  # 每月第一天
                labels.append(date.strftime('%Y/%m'))
        elif period == 'yearly':
            if date.month == 1 and date.day == 1:  # 每年第一天
                labels.append(date.strftime('%Y'))
        
        # 生成价格数据
        day_factor = i / days
        seasonal = math.sin(day_factor * 2 * math.pi) * 30
        trend = i * 0.5
        noise = (random.random() - 0.5) * 20
        
        market_price = base_market + seasonal + trend + noise
        planned_price = base_planned + seasonal * 0.8 + trend * 0.9 + noise * 0.7
        benchmark_price = base_benchmark + seasonal * 0.9 + trend * 0.95 + noise * 0.8
        
        market_prices.append(round(market_price, 2))
        planned_prices.append(round(planned_price, 2))
        benchmark_prices.append(round(benchmark_price, 2))
    
    # 如果标签为空，使用简化标签
    if not labels:
        labels = [str(i+1) for i in range(min(10, days))]
        market_prices = market_prices[:len(labels)]
        planned_prices = planned_prices[:len(labels)]
        benchmark_prices = benchmark_prices[:len(labels)]
    
    return {
        'labels': labels,
        'market': market_prices,
        'planned': planned_prices,
        'benchmark': benchmark_prices
    }

if __name__ == '__main__':
    print("="*70)
    print("🏭 煤炭双轨制价格预测系统 - 稳健版API服务器")
    print("="*70)
    print("🔧 特点:")
    print("  • 使用纯模拟数据，无网络请求")
    print("  • 避免网络依赖导致的卡死问题")
    print("  • 实时响应，无延迟")
    print("  • 专为网站集成优化")
    print()
    print(f"启动时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"工作目录: {os.getcwd()}")
    print(f"静态文件目录: {app.static_folder}")
    print()
    print("🌐 可用API端点:")
    print("  GET  /api/status           - 系统状态")
    print("  POST /api/dual-track/analyze - 双轨制分析")
    print("  GET  /api/dual-track/quick - 快速双轨制分析")
    print("  GET  /api/market/trend     - 市场趋势")
    print("  GET  /api/price/history    - 价格历史")
    print("  GET  /api/system/info      - 系统信息")
    print()
    print("🚀 服务器启动中...")
    print(f"📡 访问地址: http://localhost:5002")
    print("="*70)
    
    # 使用生产模式，禁用调试和重载器
    app.run(host='0.0.0.0', port=5002, debug=False, use_reloader=False)