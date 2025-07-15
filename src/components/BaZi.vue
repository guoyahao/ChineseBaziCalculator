<template>
  <div class="bazi">
    <div class="container">
      <h1 class="page-title">🎯 八字福运</h1>
      <p class="page-subtitle">天官赐福，请输入您的出生信息，为您分析福运走势</p>
      
      <div class="main-layout">
        <!-- 左侧输入区域 -->
      <div class="input-section">
        <div class="input-card">
          <h3>出生信息</h3>
          <form @submit.prevent="calculateBaZi" class="form">
            <div class="form-group">
              <label>姓名</label>
              <input v-model="form.name" type="text" placeholder="请输入您的姓名" required>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>性别</label>
                <select v-model="form.gender" required>
                  <option value="">请选择</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>出生年份</label>
                <select v-model="form.year" required>
                  <option value="">请选择年份</option>
                  <option v-for="year in years" :key="year" :value="year">{{ year }}年</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>出生月份</label>
                <select v-model="form.month" required>
                  <option value="">请选择月份</option>
                  <option v-for="month in 12" :key="month" :value="month">{{ month }}月</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>出生日期</label>
                <select v-model="form.day" required>
                  <option value="">请选择日期</option>
                  <option v-for="day in getDaysInMonth()" :key="day" :value="day">{{ day }}日</option>
                </select>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>出生时辰</label>
                <select v-model="form.hour" required>
                  <option value="">请选择时辰</option>
                  <option v-for="(time, index) in timeOptions" :key="index" :value="index">{{ time }}</option>
                </select>
              </div>
            </div>
            
            <button type="submit" class="calculate-btn" :disabled="loading">
              {{ loading ? '计算中...' : '开始算命' }}
            </button>
          </form>
        </div>
      </div>
      
        <!-- 右侧结果区域 -->
        <div class="result-section">
          <div v-if="result" class="result-card">
          <h3>{{ form.name }} 的八字命盘</h3>
          
          <div class="bazi-chart">
            <div class="bazi-pillars">
              <div class="pillar">
                <div class="pillar-title">年柱</div>
                <div class="gan">{{ result.yearGan }}</div>
                <div class="zhi">{{ result.yearZhi }}</div>
              </div>
              <div class="pillar">
                <div class="pillar-title">月柱</div>
                <div class="gan">{{ result.monthGan }}</div>
                <div class="zhi">{{ result.monthZhi }}</div>
              </div>
              <div class="pillar">
                <div class="pillar-title">日柱</div>
                <div class="gan">{{ result.dayGan }}</div>
                <div class="zhi">{{ result.dayZhi }}</div>
              </div>
              <div class="pillar">
                <div class="pillar-title">时柱</div>
                <div class="gan">{{ result.hourGan }}</div>
                <div class="zhi">{{ result.hourZhi }}</div>
              </div>
            </div>
          </div>
          
          <div class="analysis">
            <h4>命理分析</h4>
            <div class="analysis-item">
              <strong>五行属性：</strong>{{ result.element }}
            </div>
            <div class="analysis-item">
              <strong>性格特点：</strong>{{ result.personality }}
            </div>
            <div class="analysis-item">
              <strong>运势分析：</strong>{{ result.fortune }}
            </div>
            <div class="analysis-item">
              <strong>建议：</strong>{{ result.advice }}
              </div>
            </div>
          </div>
          
          <div v-else class="no-result">
            <div class="no-result-content">
              <div class="bazi-icon">🎯</div>
              <h3>等待算命</h3>
              <p>请在左侧输入您的出生信息<br>开始八字算命</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaZi',
  data() {
    return {
      loading: false,
      form: {
        name: '',
        gender: '',
        year: '',
        month: '',
        day: '',
        hour: ''
      },
      result: null,
      timeOptions: [
        '子时 (23:00-01:00)',
        '丑时 (01:00-03:00)',
        '寅时 (03:00-05:00)',
        '卯时 (05:00-07:00)',
        '辰时 (07:00-09:00)',
        '巳时 (09:00-11:00)',
        '午时 (11:00-13:00)',
        '未时 (13:00-15:00)',
        '申时 (15:00-17:00)',
        '酉时 (17:00-19:00)',
        '戌时 (19:00-21:00)',
        '亥时 (21:00-23:00)'
      ],
      tianGan: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
      diZhi: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
      elements: ['木', '火', '土', '金', '水'],
      personalities: {
        '木': '性格温和，富有同情心，具有创造力和想象力',
        '火': '性格热情，积极向上，具有领导能力和行动力',
        '土': '性格稳重，踏实可靠，具有耐心和责任心',
        '金': '性格坚毅，意志坚强，具有决断力和执行力',
        '水': '性格灵活，善于变通，具有智慧和洞察力'
      }
    }
  },
  computed: {
    years() {
      const currentYear = new Date().getFullYear()
      const years = []
      for (let i = currentYear; i >= currentYear - 100; i--) {
        years.push(i)
      }
      return years
    }
  },
  methods: {
    getDaysInMonth() {
      if (!this.form.year || !this.form.month) return 31
      const daysInMonth = new Date(this.form.year, this.form.month, 0).getDate()
      const days = []
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i)
      }
      return days
    },
    
    calculateBaZi() {
      this.loading = true
      
      // 模拟计算过程
      setTimeout(() => {
        const yearIndex = (this.form.year - 1984) % 10
        const monthIndex = (this.form.month - 1) % 10
        const dayIndex = (this.form.day - 1) % 10
        const hourIndex = this.form.hour % 10
        
        const yearZhiIndex = (this.form.year - 1984) % 12
        const monthZhiIndex = (this.form.month - 1) % 12
        const dayZhiIndex = (this.form.day - 1) % 12
        const hourZhiIndex = this.form.hour % 12
        
        const element = this.elements[yearIndex % 5]
        
        this.result = {
          yearGan: this.tianGan[yearIndex],
          yearZhi: this.diZhi[yearZhiIndex],
          monthGan: this.tianGan[monthIndex],
          monthZhi: this.diZhi[monthZhiIndex],
          dayGan: this.tianGan[dayIndex],
          dayZhi: this.diZhi[dayZhiIndex],
          hourGan: this.tianGan[hourIndex],
          hourZhi: this.diZhi[hourZhiIndex],
          element: element,
          personality: this.personalities[element],
          fortune: this.generateFortune(),
          advice: this.generateAdvice(element)
        }
        
        this.loading = false
      }, 2000)
    },
    
    generateFortune() {
      const fortunes = [
        '近期运势较好，适合开展新的事业或投资',
        '感情运势稳定，单身者有机会遇到心仪对象',
        '财运亨通，但需注意理财规划',
        '事业运势上升，但需要耐心等待机会',
        '健康状况良好，但需注意作息规律'
      ]
      return fortunes[Math.floor(Math.random() * fortunes.length)]
    },
    
    generateAdvice(element) {
      const advices = {
        '木': '宜多接触自然，培养耐心，避免过于急躁',
        '火': '宜保持热情，但需学会控制情绪，避免冲动',
        '土': '宜脚踏实地，循序渐进，避免好高骛远',
        '金': '宜坚持原则，但需学会变通，避免过于固执',
        '水': '宜顺势而为，灵活应变，避免优柔寡断'
      }
      return advices[element]
    }
  }
}
</script>

<style scoped>
.bazi {
  min-height: 100vh;
  color: white;
}

.container {
  max-width: 800px;
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

.input-section {
  flex: 1;
}

.input-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: fit-content;
}

.input-card h3 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.form-group select option {
  background: #333;
  color: white;
}

.calculate-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.calculate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.calculate-btn:disabled {
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
  height: 100%;
  overflow-y: auto;
}

.result-card h3 {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #4a5568;
}

.bazi-chart {
  margin-bottom: 2rem;
}

.bazi-pillars {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.pillar {
  text-align: center;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 1rem;
  border-radius: 15px;
}

.pillar-title {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.gan, .zhi {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.25rem 0;
}

.analysis {
  margin-top: 2rem;
}

.analysis h4 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #4a5568;
}

.analysis-item {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

.no-result {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
}

.no-result-content {
  text-align: center;
  max-width: 300px;
}

.bazi-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-result h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.no-result p {
  margin: 0;
  color: #666;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }
  
  .bazi-pillars {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .container {
    padding: 0 1rem;
  }
}
</style> 