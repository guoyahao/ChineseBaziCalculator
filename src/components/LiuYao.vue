<template>
  <div class="liuyao">
    <div class="container">
      <h1 class="page-title">☯️ 六爻占福</h1>
      <p class="page-subtitle">天官降福，诚心摇卦，洞察福运发展</p>
      
      <div class="main-layout">
        <!-- 左侧摇卦区域 -->
      <div class="divination-section">
        <div class="input-card">
          <h3>摇卦占卜</h3>
          
          <div class="question-section">
            <div class="form-group">
              <label>您的姓名</label>
              <input v-model="form.name" type="text" placeholder="请输入您的姓名" required>
            </div>
              
              <div class="form-group">
                <label>占卜类型</label>
                <select v-model="form.type" class="form-select">
                  <option value="">请选择占卜类型</option>
                  <option v-for="type in divinationTypes" :key="type.value" :value="type.value">
                    {{ type.label }} - {{ type.description }}
                  </option>
                </select>
              </div>
            
            <div class="form-group">
              <label>占卜问题</label>
                <textarea v-model="form.question" placeholder="请详细描述您想要占卜的具体问题" rows="3" required></textarea>
              </div>
              
              <div class="form-group">
                <label>起卦时间</label>
                <div class="time-input">
                  <input v-model="form.date" type="date" />
                  <input v-model="form.time" type="time" />
                  <button @click="setCurrentTime" class="current-time-btn">当前时间</button>
                </div>
            </div>
          </div>
          
          <div class="coin-section">
            <h4>摇卦方式</h4>
            <p class="instruction">请连续摇卦6次，每次点击下方按钮模拟投掷三枚铜钱</p>
            
            <div class="coins-display" v-if="currentThrow.length > 0">
              <div class="coin" v-for="(coin, index) in currentThrow" :key="index" :class="coin">
                {{ coin === 'heads' ? '字' : '背' }}
              </div>
            </div>
            
            <button 
              @click="throwCoins" 
              :disabled="loading || hexagram.length >= 6"
              class="throw-btn"
            >
              {{ loading ? '摇卦中...' : `第${hexagram.length + 1}次摇卦` }}
            </button>
            
            <div class="progress">
              <div class="progress-bar" :style="{ width: (hexagram.length / 6) * 100 + '%' }"></div>
            </div>
            <p class="progress-text">进度: {{ hexagram.length }}/6</p>
          </div>
          
          <div v-if="hexagram.length === 6" class="hexagram-display">
            <h4>卦象生成</h4>
            <div class="hexagram-lines">
              <div 
                v-for="(line, index) in hexagram" 
                :key="index" 
                class="hexagram-line"
                :class="{ 'yang': line.type === 'yang', 'yin': line.type === 'yin', 'changing': line.changing }"
              >
                <div class="line-visual">
                  <span v-if="line.type === 'yang'" class="yang-line">━━━━━━</span>
                  <span v-else class="yin-line">━━　━━</span>
                  <span v-if="line.changing" class="changing-mark">○</span>
                </div>
                <span class="line-name">{{ getLineName(5 - index) }}</span>
              </div>
            </div>
            
            <button @click="interpretHexagram" class="interpret-btn" :disabled="interpreting">
              {{ interpreting ? '解析中...' : '开始解卦' }}
            </button>
          </div>
        </div>
      </div>
      
        <!-- 右侧结果区域 -->
        <div class="result-section">
          <div v-if="result" class="result-card">
          <h3>{{ form.name }} 的卦象解析</h3>
            <div class="divination-info">
              <p><strong>占卜类型：</strong>{{ getDivinationType() }}</p>
              <p><strong>占卜问题：</strong>{{ form.question }}</p>
              <p><strong>起卦时间：</strong>{{ form.date }} {{ form.time }}</p>
            </div>
          
          <div class="hexagram-info">
            <div class="hexagram-name">
                <h4>第{{ result.hexagramNumber }}卦　{{ result.hexagramName }}</h4>
              <p class="hexagram-description">{{ result.hexagramDescription }}</p>
                <p class="trigram-info">上卦：{{ result.upperTrigram }}　下卦：{{ result.lowerTrigram }}</p>
                <div v-if="result.changingLines.length > 0" class="changing-lines">
                  <strong>动爻：</strong>{{ result.changingLines.join('、') }}爻
                </div>
            </div>
            
            <div class="hexagram-visual-large">
              <div 
                v-for="(line, index) in hexagram" 
                :key="index" 
                class="hexagram-line-large"
                  :class="{ 'yang': line.type === 'yang', 'yin': line.type === 'yin', 'changing': line.changing }"
              >
                <span v-if="line.type === 'yang'" class="yang-line-large">━━━━━━━━━</span>
                <span v-else class="yin-line-large">━━━　　━━━</span>
                  <span v-if="line.changing" class="changing-mark-large">○</span>
                  <span class="line-position">{{ getLineName(5 - index) }}</span>
              </div>
            </div>
          </div>
          
          <div class="interpretation">
            <h4>卦象解释</h4>
            <div class="interpretation-item">
              <strong>总体运势：</strong>{{ result.overall }}
            </div>
            <div class="interpretation-item">
              <strong>具体分析：</strong>{{ result.detailed }}
            </div>
            <div class="interpretation-item">
              <strong>时机判断：</strong>{{ result.timing }}
            </div>
            <div class="interpretation-item">
              <strong>行动建议：</strong>{{ result.advice }}
            </div>
            <div class="interpretation-item">
              <strong>注意事项：</strong>{{ result.warning }}
            </div>
          </div>
          
          <div class="reset-section">
            <button @click="resetDivination" class="reset-btn">重新占卜</button>
            </div>
          </div>
          
          <div v-else class="no-result">
            <div class="no-result-content">
              <div class="liuyao-icon">☯️</div>
              <h3>等待起卦</h3>
              <p>请在左侧完成摇卦步骤<br>生成六爻卦象</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LiuYao',
  mounted() {
    this.setCurrentTime()
  },
  data() {
    return {
      loading: false,
      interpreting: false,
      form: {
        name: '',
        type: '',
        question: '',
        date: '',
        time: ''
      },
      currentThrow: [],
      hexagram: [],
      result: null,
      hexagrams: {
        1: { name: '乾为天', description: '元亨利贞，龙德正中', upper: '乾', lower: '乾' },
        2: { name: '坤为地', description: '厚德载物，至柔而刚', upper: '坤', lower: '坤' },
        3: { name: '水雷屯', description: '物始生而未通，难生也', upper: '坎', lower: '震' },
        4: { name: '山水蒙', description: '山下有险，蒙昧也', upper: '艮', lower: '坎' },
        5: { name: '水天需', description: '云上于天，需时也', upper: '坎', lower: '乾' },
        6: { name: '天水讼', description: '天与水违行，争讼', upper: '乾', lower: '坎' },
        7: { name: '地水师', description: '地中有水，师众也', upper: '坤', lower: '坎' },
        8: { name: '水地比', description: '水在地上，比辅也', upper: '坎', lower: '坤' },
        9: { name: '风天小畜', description: '风行天上，小畜也', upper: '巽', lower: '乾' },
        10: { name: '天泽履', description: '上天下泽，履也', upper: '乾', lower: '兑' },
        11: { name: '地天泰', description: '天地交泰，通也', upper: '坤', lower: '乾' },
        12: { name: '天地否', description: '天地不交，闭塞', upper: '乾', lower: '坤' },
        13: { name: '天火同人', description: '天与火同，同人', upper: '乾', lower: '离' },
        14: { name: '火天大有', description: '火在天上，大有', upper: '离', lower: '乾' },
        15: { name: '地山谦', description: '地中有山，谦也', upper: '坤', lower: '艮' },
        16: { name: '雷地豫', description: '雷出地奋，豫也', upper: '震', lower: '坤' }
      },
      divinationTypes: [
        { value: 'general', label: '综合运势', description: '整体运势发展' },
        { value: 'career', label: '事业工作', description: '职场发展、工作变动' },
        { value: 'love', label: '感情婚姻', description: '恋爱、婚姻、感情状况' },
        { value: 'wealth', label: '财运投资', description: '财运、投资、理财' },
        { value: 'health', label: '健康平安', description: '身体健康、疾病康复' },
        { value: 'study', label: '学业考试', description: '学习、考试、升学' },
        { value: 'travel', label: '出行搬迁', description: '旅行、搬家、迁移' },
        { value: 'lawsuit', label: '官司诉讼', description: '法律纠纷、官司' }
      ],
      lineNames: ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻']
    }
  },
  methods: {
    throwCoins() {
      if (this.hexagram.length >= 6) return
      
      this.loading = true
      this.currentThrow = []
      
      // 模拟投掷三枚铜钱的动画效果
      const throwAnimation = setInterval(() => {
        this.currentThrow = Array(3).fill().map(() => 
          Math.random() > 0.5 ? 'heads' : 'tails'
        )
      }, 100)
      
      setTimeout(() => {
        clearInterval(throwAnimation)
        
        // 计算最终结果
        const finalThrow = Array(3).fill().map(() => 
          Math.random() > 0.5 ? 'heads' : 'tails'
        )
        this.currentThrow = finalThrow
        
        // 根据三枚铜钱的结果确定爻的性质
        const headsCount = finalThrow.filter(coin => coin === 'heads').length
        let lineType, changing = false
        
        switch (headsCount) {
          case 0: // 三个背面 - 老阴（变爻）
            lineType = 'yin'
            changing = true
            break
          case 1: // 一个字面，两个背面 - 少阳
            lineType = 'yang'
            break
          case 2: // 两个字面，一个背面 - 少阴
            lineType = 'yin'
            break
          case 3: // 三个字面 - 老阳（变爻）
            lineType = 'yang'
            changing = true
            break
        }
        
        this.hexagram.push({ type: lineType, changing })
        this.loading = false
      }, 1500)
    },
    
    getLineName(index) {
      return this.lineNames[index]
    },
    
    setCurrentTime() {
      const now = new Date()
      this.form.date = now.toISOString().split('T')[0]
      this.form.time = now.toTimeString().slice(0, 5)
    },
    
    getDivinationType() {
      const type = this.divinationTypes.find(t => t.value === this.form.type)
      return type ? type.label : '综合运势'
    },
    
    interpretHexagram() {
      if (!this.form.name || !this.form.question || !this.form.type) {
        alert('请填写完整的占卜信息')
        return
      }
      
      this.interpreting = true
      
      setTimeout(() => {
        // 根据卦象生成解释
        const hexagramNumber = this.calculateHexagramNumber()
        const hexagramInfo = this.hexagrams[hexagramNumber] || this.hexagrams[1]
        
        this.result = {
          hexagramNumber,
          hexagramName: hexagramInfo.name,
          hexagramDescription: hexagramInfo.description,
          upperTrigram: hexagramInfo.upper,
          lowerTrigram: hexagramInfo.lower,
          overall: this.generateOverallFortune(),
          detailed: this.generateDetailedAnalysis(),
          timing: this.generateTimingAdvice(),
          advice: this.generateActionAdvice(),
          warning: this.generateWarning(),
          changingLines: this.getChangingLines()
        }
        
        this.interpreting = false
      }, 2000)
    },
    
    calculateHexagramNumber() {
      // 计算上卦和下卦
      const upperTrigram = this.calculateTrigram(this.hexagram.slice(3, 6))
      const lowerTrigram = this.calculateTrigram(this.hexagram.slice(0, 3))
      
      // 根据八卦组合计算64卦编号
      const trigramMap = {
        '111': 1, // 乾
        '000': 2, // 坤
        '100': 3, // 震
        '010': 4, // 坎
        '001': 5, // 艮
        '011': 6, // 巽
        '101': 7, // 离
        '110': 8  // 兑
      }
      
      const upper = trigramMap[upperTrigram] || 1
      const lower = trigramMap[lowerTrigram] || 1
      
      // 简化的64卦映射
      const hexagramNumber = ((upper - 1) * 8 + lower)
      return hexagramNumber > 16 ? (hexagramNumber % 16) + 1 : hexagramNumber
    },
    
    calculateTrigram(lines) {
      return lines.map(line => line.type === 'yang' ? '1' : '0').join('')
    },
    
    getChangingLines() {
      return this.hexagram
        .map((line, index) => line.changing ? index + 1 : null)
        .filter(line => line !== null)
    },
    
    generateOverallFortune() {
      const fortunes = [
        '整体运势较为顺利，但需要耐心等待',
        '当前处于转折期，变化即将到来',
        '运势平稳，适合稳扎稳打',
        '机遇与挑战并存，需要谨慎抉择',
        '运势上升，是行动的好时机',
        '需要低调行事，避免锋芒太露',
        '困难只是暂时的，坚持就能成功',
        '贵人运旺盛，会有人相助'
      ]
      return fortunes[Math.floor(Math.random() * fortunes.length)]
    },
    
    generateDetailedAnalysis() {
      const analyses = [
        '从卦象来看，您所询问的事情需要更多的耐心和准备，不宜急于求成',
        '卦象显示事情会有转机，但需要您主动把握机会',
        '当前的困难是成长的必经之路，保持积极心态很重要',
        '您的想法是正确的，但执行时需要更加细致',
        '周围环境对您有利，可以大胆尝试',
        '需要调整策略，原来的方法可能不太适用',
        '合作比单打独斗更容易成功',
        '时机尚未成熟，建议再观察一段时间'
      ]
      return analyses[Math.floor(Math.random() * analyses.length)]
    },
    
    generateTimingAdvice() {
      const timings = [
        '最佳时机在下个月中旬，届时行动成功率更高',
        '春季是您的幸运季节，很多事情会有突破',
        '近期不宜做重大决定，建议等待更好的时机',
        '时机已经成熟，可以立即行动',
        '秋季会有好消息传来，耐心等待',
        '周二和周五是您的幸运日，重要事情可以选择这些日子',
        '月初和月末是关键时期，需要特别关注',
        '耐心等待三个月，届时会有明显改善'
      ]
      return timings[Math.floor(Math.random() * timings.length)]
    },
    
    generateActionAdvice() {
      const advices = [
        '建议多与有经验的人交流，听取他们的意见',
        '保持学习的心态，不断提升自己的能力',
        '团结身边的人，集体的力量更强大',
        '做事要有计划，一步一个脚印地前进',
        '保持乐观的心态，积极面对挑战',
        '适当的休息和调整有助于更好地发挥',
        '诚实守信，建立良好的人际关系',
        '抓住当前的机会，不要犹豫不决'
      ]
      return advices[Math.floor(Math.random() * advices.length)]
    },
    
    generateWarning() {
      const warnings = [
        '避免与人发生争执，和谐相处更重要',
        '不要过于贪心，适可而止是明智的选择',
        '注意身体健康，不要因为忙碌而忽视休息',
        '谨慎理财，避免不必要的开支',
        '保持低调，不要过分张扬',
        '注意细节，小的疏忽可能导致大的问题',
        '避免冲动决定，三思而后行',
        '保持谦虚的态度，骄傲会带来失败'
      ]
      return warnings[Math.floor(Math.random() * warnings.length)]
    },
    
    resetDivination() {
      this.form = { name: '', type: '', question: '', date: '', time: '' }
      this.currentThrow = []
      this.hexagram = []
      this.result = null
    }
  }
}
</script>

<style scoped>
.liuyao {
  min-height: 100vh;
  color: white;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
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
}

.divination-section {
  flex: 1;
}

.input-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 2rem;
}

.input-card h3 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  font-family: inherit;
}

.form-group select option {
  background: #333;
  color: white;
}

.time-input {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.time-input input {
  flex: 1;
}

.current-time-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.current-time-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.coin-section {
  text-align: center;
  margin-top: 2rem;
}

.coin-section h4 {
  margin-bottom: 1rem;
}

.instruction {
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.coins-display {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
}

.coin {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.coin.heads {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #333;
}

.coin.tails {
  background: linear-gradient(135deg, #c0c0c0, #e5e5e5);
  color: #333;
}

.throw-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 1rem 0;
}

.throw-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.throw-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.progress {
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  margin: 1rem 0;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.progress-text {
  margin-top: 0.5rem;
  opacity: 0.9;
}

.hexagram-display {
  margin-top: 2rem;
  text-align: center;
}

.hexagram-lines {
  margin: 2rem 0;
}

.hexagram-line {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.5rem 0;
  gap: 1rem;
}

.line-visual {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.yang-line, .yin-line {
  font-size: 1.5rem;
  font-weight: bold;
}

.yang-line {
  color: #ffd700;
}

.yin-line {
  color: #87ceeb;
}

.changing-mark {
  color: #ff6b6b;
  font-size: 1.2rem;
  font-weight: bold;
}

.line-name {
  font-size: 0.9rem;
  opacity: 0.8;
  min-width: 50px;
}

.interpret-btn {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.interpret-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.interpret-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.result-section {
  flex: 1;
}

.result-card {
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.result-card h3 {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #4a5568;
}

.divination-info {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f0f8ff;
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

.divination-info p {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.trigram-info {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
}

.changing-lines {
  margin-top: 0.5rem;
  color: #e53e3e;
  font-size: 0.9rem;
}

.hexagram-info {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 2rem;
  margin-bottom: 2rem;
  align-items: center;
}

.hexagram-name h4 {
  font-size: 1.5rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.hexagram-description {
  color: #666;
  font-style: italic;
}

.hexagram-visual-large {
  text-align: center;
}

.hexagram-line-large {
  margin: 0.3rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.yang-line-large, .yin-line-large {
  font-size: 1.2rem;
  font-weight: bold;
  flex: 1;
  text-align: center;
}

.yang-line-large {
  color: #ffd700;
}

.yin-line-large {
  color: #87ceeb;
}

.changing-mark-large {
  color: #e53e3e;
  font-size: 1rem;
  font-weight: bold;
  margin-left: 0.5rem;
}

.line-position {
  font-size: 0.8rem;
  color: #666;
  min-width: 40px;
  text-align: right;
}

.interpretation h4 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #4a5568;
}

.interpretation-item {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 10px;
  border-left: 4px solid #f093fb;
  line-height: 1.6;
}

.reset-section {
  text-align: center;
  margin-top: 2rem;
}

.reset-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.no-result {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.no-result-content {
  padding: 2rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.liuyao-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-result-content h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.no-result-content p {
  font-size: 1rem;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .main-layout {
    flex-direction: column;
    gap: 1rem;
  }
  
  .hexagram-info {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .coins-display {
    gap: 0.5rem;
  }
  
  .coin {
    width: 50px;
    height: 50px;
    font-size: 1rem;
  }
}
</style> 