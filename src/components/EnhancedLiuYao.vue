<template>
  <div class="enhanced-liuyao">
    <div class="container">
      <h1 class="page-title">☯️ 六爻占福 - 增强版</h1>
      <p class="page-subtitle">多种起卦方式，天官赐福，精准洞察福运</p>
      
      <div class="main-layout">
        <!-- 左侧起卦区域 -->
        <div class="hexagram-section">
          <!-- 起卦方式选择 -->
          <div v-if="!hexagramMethod" class="method-selection">
            <div class="method-card">
              <h3>选择起卦方式</h3>
              <div class="method-grid">
                <div class="method-item" @click="selectMethod('time')">
                  <div class="method-icon">⏰</div>
                  <h4>时间起卦</h4>
                  <p>根据当前时间的年月日时数理起卦</p>
                </div>
                
                <div class="method-item" @click="selectMethod('manual')">
                  <div class="method-icon">🪙</div>
                  <h4>手动摇卦</h4>
                  <p>传统三枚铜钱摇卦方式</p>
                </div>
                
                <div class="method-item" @click="selectMethod('name')">
                  <div class="method-icon">📝</div>
                  <h4>姓名起卦</h4>
                  <p>根据姓名笔画数起卦</p>
                </div>
                
                <div class="method-item" @click="selectMethod('number')">
                  <div class="method-icon">🔢</div>
                  <h4>数字起卦</h4>
                  <p>输入两个数字起卦</p>
                </div>
                
                <div class="method-item" @click="selectMethod('auto')">
                  <div class="method-icon">🎲</div>
                  <h4>电脑自动</h4>
                  <p>电脑随机生成卦象</p>
                </div>
                
                <div class="method-item" @click="selectMethod('calendar')">
                  <div class="method-icon">📅</div>
                  <h4>万年历起卦</h4>
                  <p>结合黄历选择吉时起卦</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 具体起卦界面 -->
          <div v-if="hexagramMethod" class="hexagram-interface">
            <div class="method-header">
              <h3>{{ getMethodName() }}</h3>
              <button @click="resetMethod" class="back-btn">重新选择</button>
            </div>
            
            <!-- 基础信息表单 -->
            <div class="basic-form">
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
            </div>
            
            <!-- 时间起卦 -->
            <div v-if="hexagramMethod === 'time'" class="hexagram-method-content">
              <div class="method-section">
                <h4>时间起卦设置</h4>
                <div class="time-input">
                  <input v-model="form.date" type="date" />
                  <input v-model="form.time" type="time" />
                  <button @click="setCurrentTime" class="current-time-btn">当前时间</button>
                </div>
                <button @click="generateTimeHexagram" class="generate-btn" :disabled="!canGenerate">
                  根据时间起卦
                </button>
              </div>
            </div>
            
            <!-- 手动摇卦 -->
            <div v-if="hexagramMethod === 'manual'" class="hexagram-method-content">
              <div class="method-section">
                <h4>手动摇卦 ({{ hexagram.length }}/6)</h4>
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
              </div>
            </div>
            
            <!-- 姓名起卦 -->
            <div v-if="hexagramMethod === 'name'" class="hexagram-method-content">
              <div class="method-section">
                <h4>姓名起卦</h4>
                <div class="name-input">
                  <div class="form-group">
                    <label>姓氏</label>
                    <input v-model="nameData.surname" type="text" placeholder="请输入姓氏" @input="calculateNameStrokes">
                  </div>
                  <div class="form-group">
                    <label>名字</label>
                    <input v-model="nameData.firstName" type="text" placeholder="请输入名字" @input="calculateNameStrokes">
                  </div>
                </div>
                <div v-if="nameData.strokes.total > 0" class="stroke-info">
                  <p>姓氏笔画：{{ nameData.strokes.surname }}</p>
                  <p>名字笔画：{{ nameData.strokes.firstName }}</p>
                  <p>总笔画：{{ nameData.strokes.total }}</p>
                </div>
                <button @click="generateNameHexagram" class="generate-btn" :disabled="!nameData.surname || !nameData.firstName">
                  根据姓名起卦
                </button>
              </div>
            </div>
            
            <!-- 数字起卦 -->
            <div v-if="hexagramMethod === 'number'" class="number-hexagram">
              <h4>数字起卦</h4>
              <div class="number-input">
                <div class="form-group">
                  <label>第一个数字 (1-999)</label>
                  <input v-model.number="numberData.first" type="number" min="1" max="999" placeholder="请输入数字">
                </div>
                <div class="form-group">
                  <label>第二个数字 (1-999)</label>
                  <input v-model.number="numberData.second" type="number" min="1" max="999" placeholder="请输入数字">
                </div>
              </div>
              <button @click="generateNumberHexagram" class="generate-btn" :disabled="!numberData.first || !numberData.second">
                根据数字起卦
              </button>
            </div>
            
            <!-- 电脑自动起卦 -->
            <div v-if="hexagramMethod === 'auto'" class="auto-hexagram">
              <h4>电脑自动起卦</h4>
              <p>点击下方按钮，让电脑为您自动生成卦象</p>
              <button @click="generateAutoHexagram" class="generate-btn">
                电脑自动起卦
              </button>
            </div>
            
            <!-- 万年历起卦 -->
            <div v-if="hexagramMethod === 'calendar'" class="calendar-hexagram">
              <h4>万年历起卦</h4>
              <p>请先选择万年历中的日期，然后返回此处起卦</p>
              <div v-if="calendarData.date" class="calendar-info">
                <p>选择日期：{{ calendarData.date }}</p>
                <p>农历：{{ calendarData.lunar }}</p>
                <p>干支：{{ calendarData.ganzhi }}</p>
              </div>
              <button @click="generateCalendarHexagram" class="generate-btn" :disabled="!calendarData.date">
                根据万年历起卦
              </button>
            </div>
            
            <!-- 卦象显示 -->
            <div v-if="hexagram.length === 6" class="hexagram-display">
              <h4>生成的卦象</h4>
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
              
              <button @click="interpretHexagram" class="interpret-btn" :disabled="interpreting || !canGenerate">
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
              <p><strong>起卦方式：</strong>{{ getMethodName() }}</p>
              <p><strong>占卜类型：</strong>{{ getDivinationType() }}</p>
              <p><strong>占卜问题：</strong>{{ form.question }}</p>
              <p v-if="form.date"><strong>起卦时间：</strong>{{ form.date }} {{ form.time }}</p>
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
              <div class="enhanced-icon">☯️</div>
              <h3>等待起卦</h3>
              <p v-if="!hexagramMethod">请选择起卦方式开始占卜</p>
              <p v-else>请完成起卦步骤生成卦象</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnhancedLiuYao',
  props: {
    calendarData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      hexagramMethod: null,
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
      nameData: {
        surname: '',
        firstName: '',
        strokes: {
          surname: 0,
          firstName: 0,
          total: 0
        }
      },
      numberData: {
        first: null,
        second: null
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
      lineNames: ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻']
    }
  },
  computed: {
    canGenerate() {
      return this.form.name && this.form.type && this.form.question
    }
  },
  mounted() {
    this.setCurrentTime()
  },
  methods: {
    selectMethod(method) {
      this.hexagramMethod = method
      if (method === 'calendar' && this.calendarData.date) {
        // 如果从万年历进入，自动填充数据
        this.form.date = this.calendarData.date
      }
    },
    
    resetMethod() {
      this.hexagramMethod = null
      this.hexagram = []
      this.currentThrow = []
      this.result = null
    },
    
    getMethodName() {
      const methods = {
        time: '时间起卦',
        manual: '手动摇卦',
        name: '姓名起卦',
        number: '数字起卦',
        auto: '电脑自动',
        calendar: '万年历起卦'
      }
      return methods[this.hexagramMethod] || ''
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
    
    // 时间起卦
    generateTimeHexagram() {
      if (!this.canGenerate) return
      
      const date = new Date(this.form.date + 'T' + this.form.time)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      
      // 时间起卦算法
      const upperNumber = (year + month + day) % 8
      const lowerNumber = (year + month + day + hour) % 8
      const changingLine = (year + month + day + hour) % 6
      
      this.generateHexagramFromNumbers(upperNumber, lowerNumber, changingLine)
    },
    
    // 手动摇卦
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
    
    // 姓名起卦
    calculateNameStrokes() {
      // 简化的笔画计算，实际应用中需要完整的笔画字典
      const getStrokes = (char) => {
        const strokes = {
          '王': 4, '李': 7, '张': 7, '刘': 6, '陈': 7, '杨': 7, '赵': 9, '黄': 11, '周': 8, '吴': 7,
          '徐': 10, '孙': 6, '胡': 9, '朱': 6, '高': 10, '林': 8, '何': 7, '郭': 10, '马': 3, '罗': 8,
          '梁': 11, '宋': 7, '郑': 8, '谢': 12, '韩': 12, '唐': 10, '冯': 5, '于': 3, '董': 12, '萧': 11,
          '程': 12, '曹': 11, '袁': 10, '邓': 4, '许': 6, '傅': 12, '沈': 7, '曾': 12, '彭': 12, '吕': 6,
          '苏': 7, '卢': 5, '蒋': 12, '蔡': 14, '贾': 10, '丁': 2, '魏': 17, '薛': 16, '叶': 5, '阎': 11,
          '余': 7, '潘': 15, '杜': 7, '戴': 17, '夏': 10, '锺': 17, '汪': 7, '田': 5, '任': 6, '姜': 9,
          '范': 8, '方': 4, '石': 5, '姚': 9, '谭': 15, '廖': 14, '邹': 7, '熊': 14, '金': 8, '陆': 7,
          '郝': 9, '孔': 4, '白': 5, '崔': 11, '康': 11, '毛': 4, '邱': 8, '秦': 10, '江': 6, '史': 5,
          '顾': 18, '侯': 9, '邵': 7, '孟': 8, '龙': 16, '万': 3, '段': 9, '雷': 13, '钱': 16, '汤': 6,
          '尹': 4, '黎': 15, '易': 8, '常': 11, '武': 8, '乔': 6, '贺': 9, '赖': 13, '龚': 11, '文': 4
        }
        return strokes[char] || char.length * 3 // 简化计算
      }
      
      this.nameData.strokes.surname = [...this.nameData.surname].reduce((sum, char) => sum + getStrokes(char), 0)
      this.nameData.strokes.firstName = [...this.nameData.firstName].reduce((sum, char) => sum + getStrokes(char), 0)
      this.nameData.strokes.total = this.nameData.strokes.surname + this.nameData.strokes.firstName
    },
    
    generateNameHexagram() {
      if (!this.nameData.surname || !this.nameData.firstName) return
      
      const upperNumber = this.nameData.strokes.surname % 8
      const lowerNumber = this.nameData.strokes.firstName % 8
      const changingLine = this.nameData.strokes.total % 6
      
      this.generateHexagramFromNumbers(upperNumber, lowerNumber, changingLine)
    },
    
    // 数字起卦
    generateNumberHexagram() {
      if (!this.numberData.first || !this.numberData.second) return
      
      const upperNumber = this.numberData.first % 8
      const lowerNumber = this.numberData.second % 8
      const changingLine = (this.numberData.first + this.numberData.second) % 6
      
      this.generateHexagramFromNumbers(upperNumber, lowerNumber, changingLine)
    },
    
    // 电脑自动起卦
    generateAutoHexagram() {
      this.hexagram = []
      for (let i = 0; i < 6; i++) {
        const random = Math.random()
        const changing = Math.random() < 0.15 // 15%概率为变爻
        this.hexagram.push({
          type: random > 0.5 ? 'yang' : 'yin',
          changing
        })
      }
    },
    
    // 万年历起卦
    generateCalendarHexagram() {
      if (!this.calendarData.date) return
      
      const date = new Date(this.calendarData.date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      
      const upperNumber = (year + month) % 8
      const lowerNumber = (month + day) % 8
      const changingLine = (year + month + day) % 6
      
      this.generateHexagramFromNumbers(upperNumber, lowerNumber, changingLine)
    },
    
    // 根据数字生成卦象
    generateHexagramFromNumbers(upper, lower, changingLineIndex) {
      const trigrams = [
        [1, 1, 1], // 乾
        [0, 0, 0], // 坤
        [1, 0, 0], // 震
        [0, 1, 0], // 坎
        [0, 0, 1], // 艮
        [0, 1, 1], // 巽
        [1, 0, 1], // 离
        [1, 1, 0]  // 兑
      ]
      
      const upperTrigram = trigrams[upper] || trigrams[0]
      const lowerTrigram = trigrams[lower] || trigrams[0]
      
      this.hexagram = []
      const allLines = [...lowerTrigram, ...upperTrigram]
      
      allLines.forEach((line, index) => {
        this.hexagram.push({
          type: line === 1 ? 'yang' : 'yin',
          changing: index === changingLineIndex
        })
      })
    },
    
    getLineName(index) {
      return this.lineNames[index]
    },
    
    // 解卦逻辑（沿用之前的方法）
    interpretHexagram() {
      if (!this.canGenerate) {
        alert('请填写完整的占卜信息')
        return
      }
      
      this.interpreting = true
      
      setTimeout(() => {
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
      const upperTrigram = this.calculateTrigram(this.hexagram.slice(3, 6))
      const lowerTrigram = this.calculateTrigram(this.hexagram.slice(0, 3))
      
      const trigramMap = {
        '111': 1, '000': 2, '100': 3, '010': 4,
        '001': 5, '011': 6, '101': 7, '110': 8
      }
      
      const upper = trigramMap[upperTrigram] || 1
      const lower = trigramMap[lowerTrigram] || 1
      
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
      this.hexagramMethod = null
      this.form = { name: '', type: '', question: '', date: '', time: '' }
      this.currentThrow = []
      this.hexagram = []
      this.result = null
      this.nameData = {
        surname: '',
        firstName: '',
        strokes: { surname: 0, firstName: 0, total: 0 }
      }
      this.numberData = { first: null, second: null }
      this.setCurrentTime()
    }
  }
}
</script>

<style scoped>
/* 完整的样式定义 */
.enhanced-liuyao {
  min-height: 100vh;
  color: white;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.main-layout {
  display: flex;
  gap: 2rem;
  min-height: 600px;
}

.hexagram-section {
  flex: 0 0 45%;
  display: flex;
  flex-direction: column;
}

.method-selection {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.method-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.method-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
  flex: 1;
}

.method-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 140px;
}

.method-item:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-5px);
}

.method-icon {
  font-size: 2.5rem;
  margin-bottom: 0.8rem;
}

.method-item h4 {
  margin: 0.5rem 0 0.3rem 0;
  font-size: 1.1rem;
  font-weight: bold;
}

.method-item p {
  opacity: 0.8;
  line-height: 1.4;
  font-size: 0.9rem;
  margin: 0;
}

.hexagram-interface {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.method-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.back-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.basic-form {
  margin-bottom: 1.5rem;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
}

.form-group {
  margin-bottom: 1rem;
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

.time-input, .name-input, .number-input {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  align-items: center;
}

.current-time-btn {
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.current-time-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.generate-btn {
  padding: 1rem 2rem;
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

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.generate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.hexagram-method-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.method-section {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  margin-bottom: 1rem;
}

.stroke-info {
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.stroke-info p {
  margin: 0.5rem 0;
}

.calendar-info {
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

/* 卦象显示样式 */
.hexagram-display {
  margin-top: 2rem;
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
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

/* 结果显示样式 */
.result-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.result-card {
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  flex: 1;
  overflow-y: auto;
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
  margin: 0.5rem 0;
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

/* 手动摇卦样式 */
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
  max-width: 300px;
}

.enhanced-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-result-content h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
}

.no-result-content p {
  font-size: 1rem;
  opacity: 0.9;
  color: white;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .main-layout {
    flex-direction: column;
    gap: 1rem;
  }
  
  .method-grid {
    grid-template-columns: 1fr;
  }
  
  .hexagram-info {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .time-input, .name-input, .number-input {
    flex-direction: column;
    gap: 1rem;
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