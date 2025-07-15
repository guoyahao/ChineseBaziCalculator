<template>
  <div class="fishing-liuyao">
    <div class="container">
      <h1 class="page-title">🎣 六爻钓鱼占卜</h1>
      <p class="page-subtitle">天官赐福，诚心摇卦，洞察鱼情，寻找最佳钓点</p>
      
      <div class="main-layout">
        <!-- 左侧操作区域 -->
        <div class="left-section">
          <div class="input-section">
            <h3>🏮 钓鱼信息</h3>
            <div class="form-group">
              <label>姓名：</label>
              <input v-model="fishingInfo.name" type="text" placeholder="请输入您的姓名" class="form-input">
            </div>
            <div class="form-group">
              <label>钓鱼地点：</label>
              <input v-model="fishingInfo.location" type="text" placeholder="如：某某水库" class="form-input">
            </div>
            <div class="form-group">
              <label>当前方位：</label>
              <div class="direction-selector">
                <button 
                  v-for="direction in directions" 
                  :key="direction.value"
                  :class="['direction-btn', { active: fishingInfo.direction === direction.value }]"
                  @click="selectDirection(direction.value)"
                >
                  {{ direction.icon }} {{ direction.label }}
                </button>
              </div>
            </div>
          </div>
          
          <div class="yao-section">
            <h3>☯️ 摇卦起卦</h3>
            <p class="instruction">诚心默念钓鱼问题，连续摇卦6次</p>
            
            <div class="coin-container">
              <div class="coins">
                <div v-for="i in 3" :key="i" :class="['coin', { shaking: isShaking }]">
                  <div class="coin-face front">正</div>
                  <div class="coin-face back">反</div>
                </div>
              </div>
              <button 
                @click="shakeCoin" 
                :disabled="isShaking || hexagram.length >= 6"
                class="shake-btn"
              >
                {{ isShaking ? '摇卦中...' : `第${hexagram.length + 1}次摇卦` }}
              </button>
            </div>
            
            <div class="hexagram-display" v-if="hexagram.length > 0">
              <h4>卦象进度 ({{ hexagram.length }}/6)</h4>
              <div class="yao-lines">
                <div 
                  v-for="(yao, index) in hexagram.slice().reverse()" 
                  :key="index"
                  :class="['yao-line', yao.type]"
                >
                  <span class="yao-name">{{ 6 - index }}爻</span>
                  <div class="line">
                    <div v-if="yao.type === 'yang'" class="yang-line"></div>
                    <div v-else class="yin-line">
                      <div class="yin-part"></div>
                      <div class="yin-gap"></div>
                      <div class="yin-part"></div>
                    </div>
                  </div>
                  <span class="yao-desc">{{ yao.coins }}</span>
                </div>
              </div>
            </div>
            
            <button 
              v-if="hexagram.length >= 6 && !result"
              @click="analyzeFishing"
              class="analyze-btn"
            >
              🎣 开始占卜钓鱼运势
            </button>
            
            <button 
              v-if="result"
              @click="resetHexagram"
              class="reset-btn"
            >
              🔄 重新摇卦
            </button>
          </div>
          
          <!-- 打赏区域 -->
          <div class="reward-section" v-if="result">
            <h3>☕ 觉得准确？</h3>
            <div class="reward-content">
              <img src="/pay.jpg" alt="收款二维码" class="pay-qrcode" @error="showPayPlaceholder = true" v-if="!showPayPlaceholder">
              <div class="pay-placeholder" v-else>
                <div class="pay-icon">💰</div>
                <p>收款二维码</p>
                <p class="pay-note">请将收款码保存为<br>/public/pay.jpg</p>
              </div>
              <p class="reward-text">如果准确了，请我喝杯咖啡！</p>
              <p class="reward-subtitle">您的支持是我们前进的动力 🙏</p>
            </div>
          </div>
        </div>
        
        <!-- 右侧结果区域 -->
        <div class="right-section">
          <div v-if="!result" class="waiting-state">
            <div class="waiting-content">
              <div class="fishing-icon">🎣</div>
              <h3>等待起卦完成</h3>
              <p>请在左侧完成摇卦和方位选择<br>开始您的钓鱼占卜之旅</p>
            </div>
          </div>
          
          <div v-else class="result-display">
            <div class="result-header">
              <h3>🏮 钓鱼运势分析</h3>
              <div class="basic-info">
                <p><strong>钓友：</strong>{{ fishingInfo.name }}</p>
                <p><strong>地点：</strong>{{ fishingInfo.location }}</p>
                <p><strong>方位：</strong>{{ getDirectionText(fishingInfo.direction) }}</p>
                <p><strong>卦象：</strong>{{ result.hexagramName }}</p>
              </div>
            </div>
            
            <!-- 九宫八卦图 -->
            <div class="bagua-map">
              <h4>🧭 九宫钓点分布图</h4>
              <div class="nine-palace">
                <div 
                  v-for="(palace, index) in ninePalace" 
                  :key="index"
                  :class="['palace-cell', palace.fishLevel]"
                  :title="palace.description"
                >
                  <div class="palace-direction">{{ palace.direction }}</div>
                  <div class="palace-trigram">{{ palace.trigram }}</div>
                  <div class="fish-indicator">{{ palace.fishIcon }}</div>
                  <div class="fish-level">{{ palace.levelText }}</div>
                </div>
              </div>
              <div class="legend">
                <div class="legend-item excellent">🐟🐟🐟 鱼情极佳</div>
                <div class="legend-item good">🐟🐟 鱼情较好</div>
                <div class="legend-item normal">🐟 鱼情一般</div>
                <div class="legend-item poor">🚫 不宜垂钓</div>
              </div>
            </div>
            
            <!-- 详细分析 -->
            <div class="detailed-analysis">
              <h4>📊 详细钓鱼分析</h4>
              <div class="analysis-content">
                <div class="analysis-item">
                  <h5>🎯 最佳钓点方位：</h5>
                  <p>{{ result.bestDirection }}</p>
                </div>
                <div class="analysis-item">
                  <h5>🐟 鱼情预测：</h5>
                  <p>{{ result.fishCondition }}</p>
                </div>
                <div class="analysis-item">
                  <h5>⏰ 最佳时间：</h5>
                  <p>{{ result.bestTime }}</p>
                </div>
                <div class="analysis-item">
                  <h5>🎣 钓法建议：</h5>
                  <p>{{ result.fishingMethod }}</p>
                </div>
                <div class="analysis-item">
                  <h5>🍀 运势提醒：</h5>
                  <p>{{ result.luckReminder }}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LiuYaoFishing',
  data() {
    return {
      fishingInfo: {
        name: '',
        location: '',
        direction: ''
      },
      directions: [
        { value: 'north', label: '北', icon: '🧭' },
        { value: 'northeast', label: '东北', icon: '🧭' },
        { value: 'east', label: '东', icon: '🧭' },
        { value: 'southeast', label: '东南', icon: '🧭' },
        { value: 'south', label: '南', icon: '🧭' },
        { value: 'southwest', label: '西南', icon: '🧭' },
        { value: 'west', label: '西', icon: '🧭' },
        { value: 'northwest', label: '西北', icon: '🧭' }
      ],
      isShaking: false,
      hexagram: [],
      result: null,
      ninePalace: [],
      showPayPlaceholder: false
    }
  },
  methods: {
    selectDirection(direction) {
      this.fishingInfo.direction = direction
    },
    
    getDirectionText(direction) {
      const dir = this.directions.find(d => d.value === direction)
      return dir ? dir.label : ''
    },
    
    shakeCoin() {
      if (this.hexagram.length >= 6) return
      
      this.isShaking = true
      
      setTimeout(() => {
        // 模拟投掷三枚铜钱
        const coins = []
        let yangCount = 0
        
        for (let i = 0; i < 3; i++) {
          const isYang = Math.random() > 0.5
          coins.push(isYang ? '正' : '反')
          if (isYang) yangCount++
        }
        
        // 根据正面数量确定爻的阴阳
        const yaoType = yangCount >= 2 ? 'yang' : 'yin'
        const coinsText = coins.join(' ')
        
        this.hexagram.push({
          type: yaoType,
          coins: coinsText,
          yangCount
        })
        
        this.isShaking = false
      }, 1000)
    },
    
    analyzeFishing() {
      if (this.hexagram.length < 6 || !this.fishingInfo.direction) return
      
      // 生成九宫八卦图
      this.generateNinePalace()
      
      // 分析卦象
      const hexagramName = this.getHexagramName()
      const analysis = this.getFishingAnalysis()
      
      this.result = {
        hexagramName,
        ...analysis
      }
    },
    
    generateNinePalace() {
      const trigrams = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷']
      const directions = ['西北', '北', '东北', '西', '中', '东', '西南', '南', '东南']
      
      // 根据卦象和方位计算每个方位的鱼情
      this.ninePalace = directions.map((dir, index) => {
        const fishLevel = this.calculateFishLevel(dir, index)
        return {
          direction: dir,
          trigram: trigrams[index % 8],
          fishLevel: fishLevel.level,
          fishIcon: fishLevel.icon,
          levelText: fishLevel.text,
          description: `${dir}方位 - ${fishLevel.description}`
        }
      })
    },
    
    calculateFishLevel(direction, index) {
      // 根据当前方位、卦象和方位索引计算鱼情
      const userDirIndex = this.directions.findIndex(d => d.value === this.fishingInfo.direction)
      const hexagramValue = this.hexagram.reduce((sum, yao, i) => {
        return sum + (yao.type === 'yang' ? 1 : 0) * Math.pow(2, i)
      }, 0)
      
      // 复杂的计算逻辑，考虑多个因素
      const score = (hexagramValue + userDirIndex + index) % 4
      
      const levels = [
        { level: 'excellent', icon: '🐟🐟🐟', text: '极佳', description: '鱼情极佳，收获满满' },
        { level: 'good', icon: '🐟🐟', text: '较好', description: '鱼情较好，有不错收获' },
        { level: 'normal', icon: '🐟', text: '一般', description: '鱼情一般，需要耐心' },
        { level: 'poor', icon: '🚫', text: '不佳', description: '不宜垂钓，建议换位' }
      ]
      
      return levels[score]
    },
    
    getHexagramName() {
      // 简化的卦名生成
      const yangCount = this.hexagram.filter(yao => yao.type === 'yang').length
      const hexagramNames = [
        '坤卦 - 厚德载物', '复卦 - 一阳来复', '临卦 - 君临天下', 
        '泰卦 - 泰来否往', '大壮 - 雷天大壮', '夬卦 - 泽天夬', '乾卦 - 乾天行健'
      ]
      return hexagramNames[Math.min(yangCount, 6)]
    },
    
    getFishingAnalysis() {
      const yangCount = this.hexagram.filter(yao => yao.type === 'yang').length
      
      // 根据阳爻数量和方位分析
      const analyses = {
        0: {
          bestDirection: '西南方向，坤土生养，水草丰美，鱼儿聚集',
          fishCondition: '鱼情平稳，需耐心等待，宜用素饵',
          bestTime: '申时、酉时（下午3-7点）',
          fishingMethod: '底钓为主，饵料宜清淡',
          luckReminder: '心平气和，静待佳音，切勿急躁'
        },
        1: {
          bestDirection: '东北方向，一阳初生，生机萌发',
          fishCondition: '鱼儿开始活跃，有小鱼咬钩',
          bestTime: '卯时、辰时（早晨5-9点）',
          fishingMethod: '浮钓结合底钓，饵料可稍腥',
          luckReminder: '新的开始，保持耐心，小有收获'
        },
        2: {
          bestDirection: '东南方向，木水相生，鱼情向好',
          fishCondition: '鱼情逐渐转好，中等鱼类咬钩',
          bestTime: '巳时、午时（上午9点-下午1点）',
          fishingMethod: '多点试钓，饵料荤素搭配',
          luckReminder: '时机渐好，可适当主动出击'
        },
        3: {
          bestDirection: '正南方向，火势旺盛，鱼儿活跃',
          fishCondition: '鱼情正佳，大鱼小鱼都有可能',
          bestTime: '午时、未时（中午11点-下午3点）',
          fishingMethod: '积极主钓，可用较大饵料',
          luckReminder: '运势正旺，把握时机，勇敢出手'
        },
        4: {
          bestDirection: '西北方向，金水相生，大鱼在深水',
          fishCondition: '有机会钓到大鱼，但需要技巧',
          bestTime: '戌时、亥时（晚上7-11点）',
          fishingMethod: '深水钓法，饵料要足够吸引',
          luckReminder: '实力展现的时候，技术决定收获'
        },
        5: {
          bestDirection: '正西方向，金气肃杀，大鱼咬钩',
          fishCondition: '大鱼频频咬钩，收获丰富',
          bestTime: '酉时、戌时（下午5-9点）',
          fishingMethod: '重装备钓大鱼，饵料要够香',
          luckReminder: '收获的季节，但要小心大鱼脱钩'
        },
        6: {
          bestDirection: '正北方向，水势汹涌，机会与挑战并存',
          fishCondition: '鱼情复杂多变，需要高超技巧',
          bestTime: '子时、丑时（晚上11点-凌晨3点）',
          fishingMethod: '随机应变，各种钓法都要准备',
          luckReminder: '至高境界，但需防物极必反'
        }
      }
      
      return analyses[yangCount] || analyses[3]
    },
    
    resetHexagram() {
      this.hexagram = []
      this.result = null
      this.ninePalace = []
    }
  }
}
</script>

<style scoped>
.fishing-liuyao {
  min-height: 100vh;
  color: white;
  background: 
    radial-gradient(circle at 20% 30%, rgba(30, 144, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(0, 191, 255, 0.1) 0%, transparent 50%);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  color: #87CEEB;
}

.page-subtitle {
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

.main-layout {
  display: flex;
  gap: 2rem;
  min-height: 600px;
}

.left-section {
  flex: 0 0 45%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.right-section {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow-y: auto;
}

.input-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.input-section h3 {
  color: #87CEEB;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #E0F6FF;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.direction-selector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.direction-btn {
  padding: 0.6rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.direction-btn:hover {
  background: rgba(135, 206, 235, 0.3);
}

.direction-btn.active {
  background: rgba(135, 206, 235, 0.5);
  border-color: #87CEEB;
}

.yao-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.yao-section h3 {
  color: #87CEEB;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.instruction {
  color: #E0F6FF;
  margin-bottom: 1.5rem;
  text-align: center;
}

.coin-container {
  text-align: center;
  margin-bottom: 2rem;
}

.coins {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.coin {
  width: 60px;
  height: 60px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.coin.shaking {
  animation: shake 1s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: rotateY(0deg); }
  25% { transform: rotateY(180deg) rotateX(180deg); }
  50% { transform: rotateY(360deg) rotateX(180deg); }
  75% { transform: rotateY(540deg); }
}

.coin-face {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  backface-visibility: hidden;
}

.coin-face.front {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #8B4513;
}

.coin-face.back {
  background: linear-gradient(135deg, #C0C0C0, #808080);
  color: white;
  transform: rotateY(180deg);
}

.shake-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #20B2AA, #48D1CC);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
}

.shake-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(32, 178, 170, 0.3);
}

.shake-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.hexagram-display {
  margin-top: 2rem;
}

.hexagram-display h4 {
  color: #87CEEB;
  margin-bottom: 1rem;
  text-align: center;
}

.yao-lines {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.yao-line {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.yao-name {
  width: 40px;
  font-size: 0.9rem;
  color: #E0F6FF;
}

.line {
  flex: 1;
  height: 8px;
  display: flex;
  align-items: center;
}

.yang-line {
  width: 100%;
  height: 6px;
  background: linear-gradient(to right, #FFD700, #FFA500);
  border-radius: 3px;
}

.yin-line {
  width: 100%;
  display: flex;
  gap: 8px;
}

.yin-part {
  flex: 1;
  height: 6px;
  background: linear-gradient(to right, #87CEEB, #20B2AA);
  border-radius: 3px;
}

.yin-gap {
  width: 8px;
}

.yao-desc {
  width: 80px;
  font-size: 0.8rem;
  color: #B0E0E6;
}

.analyze-btn, .reset-btn {
  width: 100%;
  padding: 1.2rem;
  margin-top: 1rem;
  background: linear-gradient(135deg, #FF6347, #FF4500);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.analyze-btn:hover, .reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 99, 71, 0.3);
}

.reward-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}

.reward-section h3 {
  color: #87CEEB;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.reward-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
}

.pay-qrcode {
  height: 250px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.pay-placeholder {
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.pay-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.pay-placeholder p {
  margin: 0.2rem 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
}

.pay-note {
  font-size: 0.7rem !important;
  color: rgba(255, 255, 255, 0.6) !important;
  line-height: 1.2;
}

.reward-text {
  color: #FFD700;
  font-weight: bold;
  font-size: 1rem;
  margin: 0;
}

.reward-subtitle {
  color: #E0F6FF;
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.8;
}

.waiting-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.waiting-content .fishing-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.waiting-content h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #87CEEB;
}

.waiting-content p {
  margin: 0;
  color: #E0F6FF;
  opacity: 0.8;
}

.result-display {
  padding: 2rem;
  color: #333;
  background: rgba(255, 255, 255, 0.95);
  height: 100%;
  overflow-y: auto;
}

.result-header h3 {
  color: #20B2AA;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.basic-info {
  background: #F0F8FF;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  border-left: 4px solid #20B2AA;
}

.basic-info p {
  margin: 0.3rem 0;
  color: #555;
}

.bagua-map h4 {
  color: #20B2AA;
  margin-bottom: 1rem;
  text-align: center;
}

.nine-palace {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: #ddd;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.palace-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  text-align: center;
  font-size: 0.8rem;
  position: relative;
}

.palace-cell.excellent {
  background: linear-gradient(135deg, #98FB98, #90EE90);
  color: #006400;
}

.palace-cell.good {
  background: linear-gradient(135deg, #87CEEB, #87CEFA);
  color: #004080;
}

.palace-cell.normal {
  background: linear-gradient(135deg, #F0E68C, #FFFF99);
  color: #8B7D00;
}

.palace-cell.poor {
  background: linear-gradient(135deg, #FFA07A, #FA8072);
  color: #8B0000;
}

.palace-direction {
  font-weight: bold;
  font-size: 0.7rem;
}

.palace-trigram {
  font-size: 1.2rem;
  margin: 0.2rem 0;
}

.fish-indicator {
  font-size: 0.9rem;
}

.fish-level {
  font-size: 0.6rem;
  font-weight: bold;
}

.legend {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.legend-item {
  padding: 0.3rem 0.6rem;
  border-radius: 15px;
  font-weight: 500;
}

.legend-item.excellent { background: #98FB98; color: #006400; }
.legend-item.good { background: #87CEEB; color: #004080; }
.legend-item.normal { background: #F0E68C; color: #8B7D00; }
.legend-item.poor { background: #FFA07A; color: #8B0000; }

.detailed-analysis {
  margin-top: 2rem;
}

.detailed-analysis h4 {
  color: #20B2AA;
  margin-bottom: 1rem;
}

.analysis-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.analysis-item {
  background: #F8F9FA;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #20B2AA;
}

.analysis-item h5 {
  margin: 0 0 0.5rem 0;
  color: #20B2AA;
  font-size: 1rem;
}

.analysis-item p {
  margin: 0;
  color: #555;
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .main-layout {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .left-section {
    flex: none;
  }
  
  .right-section {
    min-height: 400px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .direction-selector {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .coins {
    gap: 0.5rem;
  }
  
  .coin {
    width: 50px;
    height: 50px;
  }
  
  .nine-palace {
    font-size: 0.7rem;
  }
  
  .legend {
    font-size: 0.7rem;
  }
  
  .pay-qrcode, .pay-placeholder {
    width: 100px;
    height: 100px;
  }
  
  .reward-section {
    padding: 1rem;
  }
  
  .reward-text {
    font-size: 0.9rem;
  }
  
  .reward-subtitle {
    font-size: 0.8rem;
  }
}
</style> 