<template>
  <div class="ziwei-container">
    <!-- 主体内容 -->
    <div class="main-content">
      <!-- 左侧控制面板 -->
      <div class="left-panel">
        <div class="control-card">
          <h3>紫微斗数排盘</h3>
          
          <div class="form-section">
            <div class="form-group">
              <label>姓名</label>
              <input type="text" v-model="userConfig.name" placeholder="请输入姓名" />
            </div>
            
            <div class="form-group">
              <label>生日类型</label>
              <div class="radio-group">
                <label>
                  <input type="radio" v-model="userConfig.birthdayType" value="solar" />
                  <span>阳历</span>
                </label>
                <label>
                  <input type="radio" v-model="userConfig.birthdayType" value="lunar" />
                  <span>农历</span>
                </label>
              </div>
            </div>
            
            <div class="form-group">
              <label>生日</label>
              <input type="date" v-model="userConfig.birthday" />
            </div>
            
            <div class="form-group">
              <label>时辰</label>
              <select v-model="userConfig.birthTime">
                <option v-for="(time, index) in timeLabels" :key="index" :value="index">
                  {{ time }} ({{ getTimeRange(index) }})
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label>性别</label>
              <div class="radio-group">
                <label>
                  <input type="radio" v-model="userConfig.gender" value="male" />
                  <span>男</span>
                </label>
                <label>
                  <input type="radio" v-model="userConfig.gender" value="female" />
                  <span>女</span>
                </label>
              </div>
            </div>
            
            <button @click="generateChart" class="generate-btn">排盘</button>
          </div>
          
          <!-- 运限控制 -->
          <div v-if="astrolabe" class="horoscope-section">
            <h4>运限信息</h4>
            <div class="info-list">
              <div class="info-item">
                <span>年龄(虚岁):</span>
                <strong>{{ calculateAge() }}岁</strong>
              </div>
              <div class="info-item">
                <span>阳历:</span>
                <strong>{{ formatSolarDate() }}</strong>
              </div>
              <div class="info-item">
                <span>农历:</span>
                <strong>{{ formatLunarDate() }}</strong>
              </div>
              <div class="info-item">
                <span>时辰:</span>
                <strong>{{ getTimeDescription() }}</strong>
              </div>
            </div>
            
            <div class="scope-controls">
              <button 
                v-for="scope in scopeList" 
                :key="scope.key"
                :class="['scope-btn', { active: activatedScopes[scope.key] }]"
                @click="toggleScope(scope.key)"
              >
                {{ scope.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧主要内容 -->
      <div class="right-content">
        <!-- 中央星盘 -->
        <div class="center-panel">
        <div v-if="astrolabe" class="astrolabe-wrapper">
          <!-- 星盘主体 -->
          <div class="iztro-astrolabe">
            <!-- 12个宫位 -->
            <div 
              v-for="(palace, index) in astrolabe.palaces" 
              :key="index"
              :class="['iztro-palace', getPalaceClasses(palace, index)]"
              :style="{ gridArea: `g${index}` }"
              @mouseenter="onPalaceHover(index)"
              @mouseleave="onPalaceLeave()"
              @click="selectPalace(index)"
            >
              <!-- 主星区域 -->
              <div class="iztro-palace-major">
                <span 
                  v-for="star in getMajorStars(palace)" 
                  :key="getStarName(star)"
                  :class="getStarClasses(star, 'major')"
                >
                  {{ getStarName(star) }}
                  <span v-if="star.mutagen" class="iztro-star-mutagen" :class="`mutagen-${getMutagenIndex(star.mutagen)}`">
                    {{ getMutagenSymbol(star.mutagen) }}
                  </span>
                </span>
                <!-- 如果没有主星，显示前几个星曜 -->
                <span 
                  v-if="getMajorStars(palace).length === 0"
                  v-for="star in getAllStars(palace).slice(0, 3)" 
                  :key="getStarName(star)"
                  :class="getStarClasses(star, 'major')"
                >
                  {{ getStarName(star) }}
                </span>
                <!-- 调试信息：如果完全没有星曜 -->
                <small v-if="getAllStars(palace).length === 0" style="color: red; font-size: 10px;">
                  无星曜数据
                </small>
              </div>
              
              <!-- 辅星区域 -->
              <div class="iztro-palace-minor">
                <span 
                  v-for="star in getMinorStars(palace)" 
                  :key="getStarName(star)"
                  :class="getStarClasses(star, 'minor')"
                >
                  {{ getStarName(star) }}
                </span>
                <!-- 如果没有辅星，显示中间几个星曜 -->
                <span 
                  v-if="getMinorStars(palace).length === 0"
                  v-for="star in getAllStars(palace).slice(3, 6)" 
                  :key="getStarName(star)"
                  :class="getStarClasses(star, 'minor')"
                >
                  {{ getStarName(star) }}
                </span>
              </div>
              
              <!-- 杂曜区域 -->
              <div class="iztro-palace-adj">
                <div>
                  <span 
                    v-for="star in getMiscStars(palace).slice(5)" 
                    :key="getStarName(star)"
                    class="iztro-star iztro-star-adjective"
                  >
                    {{ getStarName(star) }}
                  </span>
                </div>
                <div>
                  <span 
                    v-for="star in getMiscStars(palace).slice(0, 5)" 
                    :key="getStarName(star)"
                    class="iztro-star iztro-star-adjective"
                  >
                    {{ getStarName(star) }}
                  </span>
                </div>
                <!-- 如果没有杂曜，显示剩余星曜 -->
                <div v-if="getMiscStars(palace).length === 0">
                  <span 
                    v-for="star in getAllStars(palace).slice(6)" 
                    :key="getStarName(star)"
                    class="iztro-star iztro-star-adjective"
                  >
                    {{ getStarName(star) }}
                  </span>
                </div>
              </div>
              
              <!-- 流曜区域 -->
              <div class="iztro-palace-horo-star">
                <div class="stars" v-if="getHoroscopeStars(index).length > 0">
                  <span 
                    v-for="star in getHoroscopeStars(index)" 
                    :key="star.name"
                    class="iztro-star iztro-star-adjective"
                  >
                    {{ star.name }}
                  </span>
                </div>
              </div>
              
              <!-- 运限标记 -->
              <div class="iztro-palace-fate">
                <!-- 运限标记点击区域 -->
                <div class="iztro-palace-fate-indicators">
                  <span 
                    v-for="indicator in getHoroscopeIndicators(index)"
                    :key="indicator.scope"
                    :class="[`iztro-palace-${indicator.scope}-active`]"
                    @click="toggleScope(indicator.scope)"
                  >
                    {{ indicator.name }}
                  </span>
                </div>

              </div>
              
              <!-- 宫位底部信息 -->
              <div class="iztro-palace-footer">
                <div>
                  <div class="iztro-palace-lft24">
                    <div>{{ palace.changsheng12 || '' }}</div>
                    <div>{{ palace.boshi12 || '' }}</div>
                  </div>
                  <div class="iztro-palace-name" @click="toggleTaichiPoint(index)">
                    <span class="iztro-palace-name-wrapper">
                      {{ palace.name }}
                    </span>
                    <span v-if="palace.isBodyPalace" class="iztro-palace-name-body">·身宫</span>
                  </div>
                </div>
                <div>
                  <div class="iztro-palace-scope">
                    <div class="iztro-palace-scope-age">{{ getAgeRange(index) }}</div>
                    <div class="iztro-palace-scope-decadal">{{ getDecadalRange(palace) }}</div>
                  </div>
                  <div class="iztro-palace-dynamic-name">
                    <span 
                      v-if="activatedScopes.decadal && horoscope?.decadal?.palaceNames"
                      class="iztro-palace-dynamic-name-decadal"
                    >
                      {{ horoscope.decadal.palaceNames[index] }}
                    </span>
                    <span 
                      v-if="activatedScopes.yearly && horoscope?.yearly?.palaceNames"
                      class="iztro-palace-dynamic-name-yearly"
                    >
                      {{ horoscope.yearly.palaceNames[index] }}
                    </span>
                    <span 
                      v-if="activatedScopes.monthly && horoscope?.monthly?.palaceNames"
                      class="iztro-palace-dynamic-name-monthly"
                    >
                      {{ horoscope.monthly.palaceNames[index] }}
                    </span>
                    <span 
                      v-if="activatedScopes.daily && horoscope?.daily?.palaceNames"
                      class="iztro-palace-dynamic-name-daily"
                    >
                      {{ horoscope.daily.palaceNames[index] }}
                    </span>
                    <span 
                      v-if="activatedScopes.hourly && horoscope?.hourly?.palaceNames"
                      class="iztro-palace-dynamic-name-hourly"
                    >
                      {{ horoscope.hourly.palaceNames[index] }}
                    </span>
                  </div>
                </div>
                <div>
                  <div class="iztro-palace-rgt24">
                    <div>{{ palace.suiqian12 || '' }}</div>
                    <div>{{ palace.jiangqian12 || '' }}</div>
                  </div>
                  <div class="iztro-palace-gz" @click="toggleHeavenlyStem(palace.heavenlyStem)">
                    <span>{{ getHeavenlyStem(palace) }}{{ getEarthlyBranch(palace) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 中央信息区 -->
            <div class="palace-center">
              <div class="center-content">
                <div class="basic-info">
                  <h3 class="center-title">
                    <span :class="`gender gender-${userConfig.gender}`">
                      {{ userConfig.gender === 'male' ? '♂' : '♀' }}
                    </span>
                    <span>基本信息</span>
                  </h3>
                  <div class="info-grid">
                    <div class="info-item">
                      <span>五行局:</span>
                      <strong>{{ getFiveElementsType() }}</strong>
                    </div>
                    <div class="info-item">
                      <span>年龄(虚岁):</span>
                      <strong>{{ calculateAge() }} 岁</strong>
                    </div>
                    <div class="info-item">
                      <span>四柱:</span>
                      <strong>{{ getChineseDate() }}</strong>
                    </div>
                    <div class="info-item">
                      <span>阳历:</span>
                      <strong>{{ formatSolarDate() }}</strong>
                    </div>
                    <div class="info-item">
                      <span>农历:</span>
                      <strong>{{ formatLunarDate() }}</strong>
                    </div>
                    <div class="info-item">
                      <span>时辰:</span>
                      <strong>{{ getFullTimeDescription() }}</strong>
                    </div>
                    <div class="info-item">
                      <span>生肖:</span>
                      <strong>{{ getZodiacAnimal() }}</strong>
                    </div>
                    <div class="info-item">
                      <span>星座:</span>
                      <strong>{{ getZodiacSign() }}</strong>
                    </div>
                    <div class="info-item">
                      <span>命主:</span>
                      <strong>{{ astrolabe.soul || '未知' }}</strong>
                    </div>
                    <div class="info-item">
                      <span>身主:</span>
                      <strong>{{ astrolabe.body || '未知' }}</strong>
                    </div>
                    <div class="info-item">
                      <span>命宫:</span>
                      <strong>{{ getMainPalaceInfo() }}</strong>
                    </div>
                    <div class="info-item">
                      <span>身宫:</span>
                      <strong>{{ getBodyPalaceInfo() }}</strong>
                    </div>
                  </div>
                </div>
                
                <div class="horoscope-info">
                  <h4>运限信息</h4>
                  <div class="horoscope-date-single">
                    <span class="date-item">农历: {{ formatLunarDate() }}</span>
                    <span class="date-item">阳历: {{ horoscopeDate }} <span v-if="isToday()" class="today-mark">今</span></span>
                    <span class="date-item time-item">当前时辰: {{ timeLabels[horoscopeHour] }}</span>
                  </div>
                  
                  <!-- 激活的运限显示 -->
                  <div v-if="hasActiveScopes()" class="active-scopes">
                    <div v-for="(isActive, scope) in activatedScopes" :key="scope" v-if="isActive" class="scope-indicator">
                      <span :class="`scope-${scope}`">{{ getScopeLabel(scope) }}</span>
                      <span class="scope-palace">{{ getScopePalace(scope) }}</span>
                    </div>
                  </div>
                  
                  <div class="horoscope-controls">
                    <div class="control-row-single">
                      <button @click="changeHoroscope('decadal', -1)" class="ctrl-btn">◀限</button>
                      <button @click="changeHoroscope('yearly', -1)" class="ctrl-btn">◀年</button>
                      <button @click="changeHoroscope('monthly', -1)" class="ctrl-btn">◀月</button>
                      <button @click="changeHoroscope('daily', -1)" class="ctrl-btn">◀日</button>
                      <button @click="changeHoroscope('hourly', -1)" class="ctrl-btn">◀时</button>
                      <div class="time-display">{{ timeLabels[horoscopeHour] }}</div>
                      <button @click="changeHoroscope('hourly', 1)" class="ctrl-btn">时▶</button>
                      <button @click="changeHoroscope('daily', 1)" class="ctrl-btn">日▶</button>
                      <button @click="changeHoroscope('monthly', 1)" class="ctrl-btn">月▶</button>
                      <button @click="changeHoroscope('yearly', 1)" class="ctrl-btn">年▶</button>
                      <button @click="changeHoroscope('decadal', 1)" class="ctrl-btn">限▶</button>
                    </div>
                  </div>
                </div>
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
import { astro } from 'iztro'

export default {
  name: 'ZiWei',
  data() {
    return {
      userConfig: {
        name: '',
        birthday: '2003-10-12',
        birthTime: 1,
        birthdayType: 'solar',
        gender: 'male'
      },
      
      astrolabe: null,
      
      // 运限相关
      horoscopeDate: new Date().toISOString().split('T')[0],
      horoscopeHour: Math.floor(new Date().getHours() / 2),
      horoscope: null,
      
      activatedScopes: {
        decadal: false,
        yearly: false,
        monthly: false,
        daily: false,
        hourly: false
      },
      
      scopeList: [
        { key: 'decadal', label: '大限' },
        { key: 'yearly', label: '流年' },
        { key: 'monthly', label: '流月' },
        { key: 'daily', label: '流日' },
        { key: 'hourly', label: '流时' }
      ],
      
      // UI状态
      selectedPalaceIndex: null,
      focusedIndex: undefined,
      activeHeavenlyStem: null,
      
      timeLabels: [
        '子时', '丑时', '寅时', '卯时', '辰时', '巳时',
        '午时', '未时', '申时', '酉时', '戌时', '亥时'
      ]
    }
  },
  
  mounted() {
    this.generateChart()
  },
  
  methods: {
    generateChart() {
      try {
        if (this.userConfig.birthdayType === 'solar') {
          this.astrolabe = astro.bySolar(
            this.userConfig.birthday,
            this.userConfig.birthTime,
            this.userConfig.gender,
            true,
            'zh-CN'
          )
        } else {
          this.astrolabe = astro.byLunar(
            this.userConfig.birthday,
            this.userConfig.birthTime,
            this.userConfig.gender,
            false,
            true,
            'zh-CN'
          )
        }
        console.log('Generated astrolabe:', this.astrolabe)
        console.log('Soul:', this.astrolabe.soul)
        console.log('Body:', this.astrolabe.body)
        console.log('Five Elements:', this.astrolabe.fiveElementsClass)
        console.log('Chinese Date:', this.astrolabe.chineseDate)
        console.log('All astrolabe properties:', Object.keys(this.astrolabe))
        // 检查宫位数据
        if (this.astrolabe && this.astrolabe.palaces) {
          console.log('第一个宫位完整数据:', this.astrolabe.palaces[0])
          this.astrolabe.palaces.forEach((palace, index) => {
            console.log(`宫位${index} - ${palace.name}:`, {
              majorStars: palace.majorStars,
              minorStars: palace.minorStars,
              miscStars: palace.miscStars,
              adjectiveStars: palace.adjectiveStars,
              stars: palace.stars,
              earthlyBranch: palace.earthlyBranch,
              heavenlyStem: palace.heavenlyStem,
              allKeys: Object.keys(palace)
            })
          })
        }
        this.updateHoroscope()
      } catch (error) {
        console.error('Failed to generate astrolabe:', error)
      }
    },
    
    // 获取宫位样式类
    getPalaceClasses(palace, index) {
      const classes = []
      if (palace.name === '命宫') classes.push('life-palace')
      if (this.focusedIndex === index) classes.push('focused-palace')
      
      // 鼠标悬停时的相关宫位高亮
      if (this.focusedIndex !== undefined && this.focusedIndex !== null) {
        // 对宫
        if ((this.focusedIndex + 6) % 12 === index) {
          classes.push('opposite-palace')
        }
        // 三方（三合宫）
        if ((this.focusedIndex + 4) % 12 === index || 
            (this.focusedIndex + 8) % 12 === index) {
          classes.push('surrounded-palace')
        }
      }
      return classes
    },
    
    // 宫位悬停
    onPalaceHover(index) {
      this.focusedIndex = index
    },
    
    // 鼠标离开宫位
    onPalaceLeave() {
      this.focusedIndex = undefined
    },
    
    // 切换天干四化
    toggleHeavenlyStem(heavenlyStem) {
      if (this.activeHeavenlyStem === heavenlyStem) {
        this.activeHeavenlyStem = null
      } else {
        this.activeHeavenlyStem = heavenlyStem
      }
    },
    
    // 选择宫位
    selectPalace(index) {
      this.selectedPalaceIndex = this.selectedPalaceIndex === index ? null : index
    },
    
    // 切换太极点
    toggleTaichiPoint(index) {
      this.selectPalace(index)
    },
    
    // 获取星曜样式
    getStarClasses(star, type) {
      const classes = ['iztro-star']
      const starName = star.name || star
      
      if (type === 'major') {
        classes.push('iztro-star-major')
      } else if (type === 'minor') {
        classes.push('iztro-star-soft')
      }
      
      // 特殊星曜
      if (starName === '天马') {
        classes.push('iztro-star-tianma')
      } else if (starName === '禄存') {
        classes.push('iztro-star-lucun')
      } else if (['红鸾', '天喜', '咸池', '沐浴', '天姚'].includes(starName)) {
        classes.push('iztro-star-flower')
      } else if (['天魁', '天钺', '左辅', '右弼'].includes(starName)) {
        classes.push('iztro-star-helper')
      } else if (['擎羊', '陀罗', '火星', '铃星', '地空', '地劫'].includes(starName)) {
        classes.push('iztro-star-tough')
      }
      
      // 四化
      if (star.mutagen) {
        classes.push('star-with-mutagen')
      }
      
      return classes
    },
    
    // 获取四化索引
    getMutagenIndex(mutagen) {
      const mutagenMap = {
        'luck': 0,
        'power': 1,
        'science': 2,
        'taboo': 3
      }
      return mutagenMap[mutagen] || 0
    },
    
    // 获取四化符号
    getMutagenSymbol(mutagen) {
      const symbols = {
        luck: '禄',
        power: '权',
        science: '科',
        taboo: '忌'
      }
      return symbols[mutagen] || ''
    },
    
    // 获取运限指示器
    getHoroscopeIndicators(index) {
      const indicators = []
      
      if (!this.horoscope) return indicators
      
      // 检查每个运限是否位于当前宫位
      if (this.horoscope.decadal?.index === index) {
        indicators.push({
          scope: 'decadal',
          name: this.horoscope.decadal.name || '大限'
        })
      }
      
      if (this.horoscope.yearly?.index === index) {
        indicators.push({
          scope: 'yearly',
          name: this.horoscope.yearly.name || '流年'
        })
      }
      
      if (this.horoscope.monthly?.index === index) {
        indicators.push({
          scope: 'monthly',
          name: this.horoscope.monthly.name || '流月'
        })
      }
      
      if (this.horoscope.daily?.index === index) {
        indicators.push({
          scope: 'daily',
          name: this.horoscope.daily.name || '流日'
        })
      }
      
      if (this.horoscope.hourly?.index === index) {
        indicators.push({
          scope: 'hourly',
          name: this.horoscope.hourly.name || '流时'
        })
      }
      
      return indicators
    },
    
    // 获取流曜
    getHoroscopeStars(index) {
      // TODO: 根据运限返回对应的流曜
      return []
    },
    
    // 获取选中的宫位
    getSelectedPalace() {
      if (!this.astrolabe || this.selectedPalaceIndex === null) return {}
      return this.astrolabe.palaces[this.selectedPalaceIndex] || {}
    },
    
    // 切换运限显示
    toggleScope(scope) {
      this.activatedScopes[scope] = !this.activatedScopes[scope]
      this.updateHoroscope()
    },
    
    // 更新运限
    updateHoroscope() {
      if (!this.astrolabe) return
      
      try {
        // 尝试使用 iztro 库生成运限数据
        if (typeof this.astrolabe.horoscope === 'function') {
          this.horoscope = this.astrolabe.horoscope(this.horoscopeDate, this.horoscopeHour)
          console.log('Generated horoscope:', this.horoscope)
        } else {
          // 如果 horoscope 方法不存在，使用模拟数据
          console.warn('astrolabe.horoscope method not available, using mock data')
          this.generateMockHoroscope()
        }
      } catch (error) {
        console.error('Failed to generate horoscope:', error)
        this.generateMockHoroscope()
      }
    },
    
    // 生成模拟运限数据
    generateMockHoroscope() {
      const currentDate = new Date(this.horoscopeDate)
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth() + 1
      const day = currentDate.getDate()
      
      // 基于时间计算运限位置，使其有一定规律性
      const decadalIndex = Math.floor((year - 2000) / 10) % 12
      const yearlyIndex = (year - 2000) % 12
      const monthlyIndex = (month - 1) % 12
      const dailyIndex = (day - 1) % 12
      const hourlyIndex = this.horoscopeHour
      
      console.log(`生成运限数据: 年=${year}, 月=${month}, 日=${day}, 时=${this.horoscopeHour}`)
      console.log(`运限位置: 大限=${decadalIndex}, 流年=${yearlyIndex}, 流月=${monthlyIndex}, 流日=${dailyIndex}, 流时=${hourlyIndex}`)
      
      // 生成完整的运限数据，包含 palaceNames 数组
      const generatePalaceNames = (scope) => {
        const baseNames = ['命宫', '父母', '福德', '田宅', '官禄', '交友', '迁移', '疾厄', '财帛', '子女', '夫妻', '兄弟']
        const scopePrefix = {
          'decadal': '大限',
          'yearly': '流年', 
          'monthly': '流月',
          'daily': '流日',
          'hourly': '流时'
        }
        
        return baseNames.map(name => `${scopePrefix[scope]}${name}`)
      }
      
      // 计算年龄（虚岁）
      const birthYear = new Date(this.userConfig.birthday).getFullYear()
      const nominalAge = year - birthYear + 1 // 虚岁计算
      
      // 直接赋值（Vue 3中已经是响应式的）
      this.horoscope = {
        age: {
          nominalAge: nominalAge // 虚岁
        },
        decadal: { 
          index: decadalIndex,
          year: Math.floor((year - 2000) / 10) * 10 + 2000,
          name: '大限',
          palaceNames: generatePalaceNames('decadal')
        },
        yearly: { 
          index: yearlyIndex,
          year: year,
          name: '流年',
          palaceNames: generatePalaceNames('yearly')
        },
        monthly: { 
          index: monthlyIndex,
          month: month,
          name: '流月',
          palaceNames: generatePalaceNames('monthly')
        },
        daily: { 
          index: dailyIndex,
          day: day,
          name: '流日',
          palaceNames: generatePalaceNames('daily')
        },
        hourly: { 
          index: hourlyIndex,
          hour: this.horoscopeHour,
          name: '流时',
          palaceNames: generatePalaceNames('hourly')
        }
      }
      
      console.log('运限数据已更新:', this.horoscope)
    },
    
    // 改变运限
    changeHoroscope(type, direction) {
      console.log(`changeHoroscope called with type: ${type}, direction: ${direction}`)
      
      // 自动激活对应的运限显示
      this.activatedScopes[type] = true
      
      const date = new Date(this.horoscopeDate)
      
      switch(type) {
        case 'decadal':
          date.setFullYear(date.getFullYear() + direction * 10)
          console.log(`大限: ${date.getFullYear()}`)
          break
        case 'yearly':
          date.setFullYear(date.getFullYear() + direction)
          console.log(`流年: ${date.getFullYear()}`)
          break
        case 'monthly':
          date.setMonth(date.getMonth() + direction)
          console.log(`流月: ${date.getMonth() + 1}`)
          break
        case 'daily':
          date.setDate(date.getDate() + direction)
          console.log(`流日: ${date.getDate()}`)
          break
        case 'hourly':
          this.horoscopeHour = (this.horoscopeHour + direction + 12) % 12
          console.log(`流时: ${this.timeLabels[this.horoscopeHour]}`)
          this.updateHoroscope() // 时辰也需要更新运限数据
          return // 时辰不需要改变日期
      }
      
      this.horoscopeDate = date.toISOString().split('T')[0]
      console.log(`Updated horoscopeDate: ${this.horoscopeDate}`)
      console.log(`激活的运限:`, this.activatedScopes)
      this.updateHoroscope()
      
      // 强制刷新视图
      this.$nextTick(() => {
        console.log('运限更新完成，当前运限数据:', this.horoscope)
        console.log('激活状态:', this.activatedScopes)
      })
    },
    
    getAgeRange(index) {
      const start = 6 + index * 10
      const end = start + 9
      return `${start} - ${end}`
    },
    
    getTimeRange(index) {
      const ranges = [
        '23:00~01:00', '01:00~03:00', '03:00~05:00', '05:00~07:00',
        '07:00~09:00', '09:00~11:00', '11:00~13:00', '13:00~15:00',
        '15:00~17:00', '17:00~19:00', '19:00~21:00', '21:00~23:00'
      ]
      return ranges[index]
    },
    
    calculateAge() {
      // 优先使用horoscope中的年龄数据（虚岁）
      if (this.horoscope?.age?.nominalAge) {
        return this.horoscope.age.nominalAge
      }
      
      // 备用计算：基于当前年份计算虚岁
      const birthYear = new Date(this.userConfig.birthday).getFullYear()
      const currentYear = new Date().getFullYear() // 使用真实的当前年份
      return currentYear - birthYear + 1 // 虚岁算法：当前年份-出生年份+1
    },
    
    // 格式化阳历日期
    formatSolarDate() {
      if (!this.astrolabe) return '未知'
      // 优先使用astrolabe中的阳历日期
      if (this.astrolabe.solarDate) {
        return this.astrolabe.solarDate
      }
      // 备用方案：使用配置的生日
      const date = new Date(this.userConfig.birthday)
      return date.toLocaleDateString('zh-CN')
    },
    
    // 格式化农历日期
    formatLunarDate() {
      if (!this.astrolabe) return '未知'
      // 直接使用react-iztro中相同的属性名
      if (this.astrolabe.lunarDate) {
        return this.astrolabe.lunarDate
      }
      return '未知'
    },
    
    getTimeDescription() {
      return this.timeLabels[this.userConfig.birthTime] || ''
    },
    
    // 获取完整的时辰描述（包括时间范围）
    getFullTimeDescription() {
      if (!this.astrolabe) return '未知'
      // 优先使用astrolabe中的时辰信息
      if (this.astrolabe.time && this.astrolabe.timeRange) {
        return `${this.astrolabe.time}(${this.astrolabe.timeRange})`
      }
      // 备用方案：使用配置的时辰
      const timeName = this.timeLabels[this.userConfig.birthTime] || ''
      const timeRange = this.getTimeRange(this.userConfig.birthTime)
      return `${timeName}(${timeRange})`
    },
    
    // 获取四柱信息
    getChineseDate() {
      if (!this.astrolabe) return '未知'
      // 直接使用react-iztro中相同的属性名
      if (this.astrolabe.chineseDate) {
        return this.astrolabe.chineseDate
      }
      return '未知'
    },
    
    // 获取生肖
    getZodiacAnimal() {
      if (!this.astrolabe) return '未知'
      // 从iztro获取生肖，使用react-iztro中相同的属性名
      if (this.astrolabe.zodiac) {
        return this.astrolabe.zodiac
      }
      // 根据年份计算生肖
      const birthYear = new Date(this.userConfig.birthday).getFullYear()
      const animals = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊']
      return animals[birthYear % 12]
    },
    
    getZodiacSign() {
      if (!this.astrolabe) return '未知'
      // 优先使用astrolabe中的星座信息
      if (this.astrolabe.sign) {
        return this.astrolabe.sign
      }
      
      // 备用方案：根据日期计算星座
      const date = new Date(this.userConfig.birthday)
      const month = date.getMonth() + 1
      const day = date.getDate()
      
      const signs = [
        '摩羯座', '水瓶座', '双鱼座', '白羊座', '金牛座', '双子座',
        '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座'
      ]
      
      const dates = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22]
      
      if (day < dates[month - 1]) {
        return signs[month - 2 < 0 ? 11 : month - 2]
      } else {
        return signs[month - 1]
      }
    },
    
    // 获取身宫信息
    getBodyPalaceInfo() {
      if (!this.astrolabe) return '未知'
      // 优先使用astrolabe中的身宫地支信息
      if (this.astrolabe.earthlyBranchOfBodyPalace) {
        return this.astrolabe.earthlyBranchOfBodyPalace
      }
      // 备用方案：通过宫位查找
      const bodyPalace = this.astrolabe.palaces?.find(p => p.isBodyPalace)
      return bodyPalace ? bodyPalace.earthlyBranch : '未知'
    },
    
    // 获取命宫信息
    getMainPalaceInfo() {
      if (!this.astrolabe) return '未知'
      // 优先使用astrolabe中的命宫地支信息
      if (this.astrolabe.earthlyBranchOfSoulPalace) {
        return this.astrolabe.earthlyBranchOfSoulPalace
      }
      // 备用方案：通过宫位查找
      const mainPalace = this.astrolabe.palaces?.find(p => p.name === '命宫')
      return mainPalace ? mainPalace.earthlyBranch : '未知'
    },
    
    // 获取五行局
    getFiveElementsType() {
      if (!this.astrolabe) return '未知'
      // 使用react-iztro中的属性名
      if (this.astrolabe.fiveElementsClass) {
        return this.astrolabe.fiveElementsClass
      }
      // 备用方案：通过命盘的年干五行判断
      const fiveElementsMap = {
        '甲': '木三局', '乙': '木三局',
        '丙': '火六局', '丁': '火六局', 
        '戊': '土五局', '己': '土五局',
        '庚': '金四局', '辛': '金四局',
        '壬': '水二局', '癸': '水二局'
      }
      const yearStem = this.astrolabe.lunar?.yearStem
      return yearStem ? (fiveElementsMap[yearStem] || '未知') : '未知'
    },
    
    // 判断是否是今天
    isToday() {
      return this.horoscopeDate === new Date().toISOString().split('T')[0]
    },
    
    // 获取主星
    getMajorStars(palace) {
      if (!palace) return []
      // 尝试多种可能的属性名
      const stars = palace.majorStars || palace.major || palace.stars || []
      if (Array.isArray(stars)) {
        return stars.filter(star => {
          const name = typeof star === 'string' ? star : star.name
          return ['紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'].includes(name)
        })
      }
      return []
    },
    
    // 获取辅星  
    getMinorStars(palace) {
      if (!palace) return []
      const stars = palace.minorStars || palace.minor || palace.stars || []
      if (Array.isArray(stars)) {
        return stars.filter(star => {
          const name = typeof star === 'string' ? star : star.name
          return ['左辅', '右弼', '天魁', '天钺', '文昌', '文曲', '禄存', '天马', '擎羊', '陀罗', '火星', '铃星', '地空', '地劫'].includes(name)
        })
      }
      return []
    },
    
    // 获取杂曜
    getMiscStars(palace) {
      if (!palace) return []
      const stars = palace.miscStars || palace.adjectiveStars || palace.misc || palace.stars || []
      if (Array.isArray(stars)) {
        // 过滤掉主星和辅星，剩下的都是杂曜
        return stars.filter(star => {
          const name = typeof star === 'string' ? star : star.name
          const majorStars = ['紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军']
          const minorStars = ['左辅', '右弼', '天魁', '天钺', '文昌', '文曲', '禄存', '天马', '擎羊', '陀罗', '火星', '铃星', '地空', '地劫']
          return !majorStars.includes(name) && !minorStars.includes(name)
        })
      }
      return []
    },
    
    // 获取大限范围
    getDecadalRange(palace) {
      if (!palace) return ''
      if (palace.decadal && palace.decadal.range) {
        return palace.decadal.range.join(' - ')
      }
      // 根据宫位索引计算大限
      // 紫微斗数中，命宫起大限的岁数根据五行局而定
      // 这里使用简化计算：从命宫开始，每个宫位管10年
      const palaceNames = ['命宫', '父母', '福德', '田宅', '官禄', '交友', '迁移', '疾厄', '财帛', '子女', '夫妻', '兄弟']
      const currentIndex = palaceNames.indexOf(palace.name)
      if (currentIndex !== -1) {
        // 假设从6岁开始，每宫10年
        const startAge = 6 + currentIndex * 10
        return `${startAge} - ${startAge + 9}`
      }
      return ''
    },
    
    // 获取年龄范围
    getAgeRange(index) {
      const startAge = 6 + index * 10
      return `${startAge} - ${startAge + 9}`
    },
    
    // 获取宫位classes
    getPalaceClasses(palace, index) {
      const classes = []
      
      // 基础宫位类
      if (palace && palace.name === '命宫') {
        classes.push('life-palace')
      }
      
      // 选中状态
      if (this.selectedPalaceIndex === index) {
        classes.push('selected-palace')
      }
      
      // 悬停效果
      if (this.focusedIndex !== undefined && this.focusedIndex !== null) {
        // 当前宫位
        if (this.focusedIndex === index) {
          classes.push('focused-palace')
        }
        // 对宫
        if ((this.focusedIndex + 6) % 12 === index) {
          classes.push('opposite-palace')
        }
        // 三方（三合宫）
        if ((this.focusedIndex + 4) % 12 === index || 
            (this.focusedIndex + 8) % 12 === index) {
          classes.push('surrounded-palace')
        }
      }
      return classes
    },
    
    // 宫位悬停
    onPalaceHover(index) {
      this.focusedIndex = index
    },
    
    // 鼠标离开宫位
    onPalaceLeave() {
      this.focusedIndex = undefined
    },
    
    // 选择宫位
    selectPalace(index) {
      this.selectedPalaceIndex = this.selectedPalaceIndex === index ? null : index
    },
    
    // 切换太极点
    toggleTaichiPoint(index) {
      this.selectPalace(index)
    },
    
    // 切换天干四化
    toggleHeavenlyStem(heavenlyStem) {
      if (this.activeHeavenlyStem === heavenlyStem) {
        this.activeHeavenlyStem = null
      } else {
        this.activeHeavenlyStem = heavenlyStem
      }
    },
    
    // 获取星曜样式
    getStarClasses(star, type) {
      const classes = ['iztro-star']
      
      if (type === 'major') {
        classes.push('iztro-star-major')
      } else if (type === 'minor') {
        classes.push('iztro-star-soft')
      } else {
        classes.push('iztro-star-adjective')
      }
      
      // 四化标记
      if (star.mutagen) {
        classes.push('star-with-mutagen')
      }
      
      return classes
    },
    
    // 获取四化等级
    getMutagenIndex(mutagen) {
      const mutagenMap = {
        'luck': 0,
        'power': 1,
        'science': 2,
        'taboo': 3
      }
      return mutagenMap[mutagen] || 0
    },
    
    // 获取四化符号
    getMutagenSymbol(mutagen) {
      const symbols = {
        luck: '禄',
        power: '权', 
        science: '科',
        taboo: '忌'
      }
      return symbols[mutagen] || ''
    },
    
    // 获取天干
    getHeavenlyStem(palace) {
      if (!palace) return ''
      return palace.heavenlyStem || palace.stem || ''
    },
    
    // 获取地支
    getEarthlyBranch(palace) {
      if (!palace) return ''
      return palace.earthlyBranch || palace.branch || ''
    },
    
    // 获取所有星曜（用于调试）
    getAllStars(palace) {
      if (!palace) return []
      // 合并所有可能的星曜属性
      const allStars = [
        ...(palace.majorStars || []),
        ...(palace.minorStars || []),
        ...(palace.miscStars || []),
        ...(palace.adjectiveStars || []),
        ...(palace.stars || [])
      ]
      return [...new Set(allStars)] // 去重
    },
    
    // 获取星曜名称
    getStarName(star) {
      if (typeof star === 'string') return star
      if (star && star.name) return star.name
      if (star && star.starName) return star.starName
      return String(star || '')
    },
    
    // 检查是否有激活的运限
    hasActiveScopes() {
      return Object.values(this.activatedScopes).some(active => active)
    },
    
    // 获取运限标签
    getScopeLabel(scope) {
      const scopeConfig = this.scopeList.find(s => s.key === scope)
      return scopeConfig ? scopeConfig.label : scope
    },
    
    // 获取运限宫位
    getScopePalace(scope) {
      if (!this.horoscope || !this.horoscope[scope]) return ''
      const index = this.horoscope[scope].index
      if (!this.astrolabe || !this.astrolabe.palaces[index]) return ''
      return this.astrolabe.palaces[index].name
    }

  }
}
</script>

<style scoped>
/* CSS变量定义 - 对应react-iztro的主题系统 */
.ziwei-container {
  --iztro-star-font-size-big: 13px;
  --iztro-star-font-size-small: 12px;
  --iztro-color-major: #531dab;
  --iztro-color-focus: #000;
  --iztro-color-quan: #2f54eb;
  --iztro-color-tough: #612500;
  --iztro-color-awesome: #d4380d;
  --iztro-color-active: #1890ff;
  --iztro-color-happy: #c41d7f;
  --iztro-color-nice: #237804;
  --iztro-color-decorator-1: #90983c;
  --iztro-color-decorator-2: #813359;
  --iztro-color-text: #8c8c8c;
  --iztro-color-border: #00152912;
  --iztro-color-decadal: var(--iztro-color-active);
  --iztro-color-yearly: var(--iztro-color-decorator-2);
  --iztro-color-monthly: var(--iztro-color-nice);
  --iztro-color-daily: var(--iztro-color-decorator-1);
  --iztro-color-hourly: var(--iztro-color-text);
}

/* 整体容器 */
.ziwei-container {
  height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  overflow: hidden;
}

/* 主体内容 */
.main-content {
  display: flex;
  gap: 20px;
  padding: 15px;
  width: 100%;
  height: calc(100vh - 30px);
}

/* 左侧控制面板 */
.left-panel {
  width: 240px;
  flex-shrink: 0;
}

/* 右侧主要内容区域 */
.right-content {
  flex: 1;
  overflow: hidden;
}

/* 中央面板 */
.center-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 星盘包装器 */
.astrolabe-wrapper {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
}

.astrolabe-wrapper .iztro-astrolabe {
  min-width: 900px;
  min-height: 600px;
}



.control-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.control-card h3 {
  margin: 0 0 20px 0;
  color: var(--iztro-color-major);
  font-size: 18px;
}

.control-card h4 {
  margin: 20px 0 10px 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
}

/* 表单样式 */
.form-section {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
  font-size: 13px;
  font-weight: 500;
}

.form-group input[type="text"],
.form-group input[type="date"],
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--iztro-color-major);
  box-shadow: 0 0 0 2px rgba(83, 29, 171, 0.1);
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-group label {
  display: flex;
  align-items: center;
  margin: 0;
  cursor: pointer;
  font-size: 14px;
}

.radio-group input[type="radio"] {
  margin-right: 5px;
}

.generate-btn {
  width: 100%;
  padding: 10px;
  background: var(--iztro-color-major);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.generate-btn:hover {
  background: #6a2ed4;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(83, 29, 171, 0.3);
}

/* 运限控制 */
.horoscope-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.info-list {
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  font-size: 13px;
  color: #666;
}

.info-item strong {
  color: #333;
}

.scope-controls {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.scope-btn {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  background: white;
  color: #666;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.scope-btn:hover {
  border-color: var(--iztro-color-major);
  color: var(--iztro-color-major);
}

.scope-btn.active {
  background: var(--iztro-color-major);
  color: white;
  border-color: var(--iztro-color-major);
}

/* 中央星盘 - 移除重复定义 */

/* 星盘主体 - 按照react-iztro标准 */
.iztro-astrolabe {
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
  display: grid;
  position: relative;
  width: 100%;
  grid-gap: 3px;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 1fr;
  grid-template-areas:
    "g3 g4 g5 g6"
    "g2 ct ct g7"
    "g1 ct ct g8"
    "g0 g11 g10 g9";
  text-align: left;
}

/* 宫位样式 - 按照react-iztro标准 */
.iztro-palace {
  padding: 3px;
  display: grid;
  text-transform: capitalize;
  grid-template-rows: auto auto auto 50px;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas:
    "major minor adj"
    "horo  horo adj"
    "fate  fate fate"
    "ft   ft  ft";
  transition: all 0.25s ease-in-out;
  grid-auto-flow: column;
  border: 1px solid var(--iztro-color-border);
}

.iztro-palace.focused-palace {
  background-color: #aab8d32f;
}

.iztro-palace.opposite-palace {
  background-color: #93f73d4f;
}

.iztro-palace.surrounded-palace {
  background-color: #aff46f24;
}

.iztro-palace.selected-palace {
  background-color: rgba(83, 29, 171, 0.1);
  border-color: var(--iztro-color-major);
  border-width: 2px;
}

.iztro-palace.life-palace {
  background-color: rgba(255, 215, 0, 0.1);
}

.iztro-palace-major {
  grid-area: major;
}

.iztro-palace-minor {
  grid-area: minor;
  justify-self: center;
}

.iztro-palace-adj {
  grid-area: adj;
  display: flex;
  flex-direction: column;
  justify-self: flex-end;
  gap: 2px;
  white-space: nowrap;
  text-align: right;
  font-size: 10px;
}

.iztro-palace-horo-star {
  grid-area: horo;
  align-self: center;
}

.iztro-palace-horo-star .stars {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
}

.iztro-palace-fate {
  grid-area: fate;
  display: flex;
  gap: 3px;
  align-items: center;
  justify-content: center;
}

.iztro-palace-fate-indicators {
  display: flex;
  gap: 3px;
  justify-content: center;
  flex-wrap: wrap;
}

.iztro-palace-fate span {
  display: block;
  padding: 0 3px;
  border-radius: 4px;
  color: #fff;
  background-color: var(--iztro-color-major);
  cursor: pointer;
  font-size: var(--iztro-star-font-size-small);
  font-weight: normal;
  white-space: nowrap;
}

.iztro-palace-fate-indicators span {
  display: inline-block;
  padding: 1px 4px;
  border-radius: 3px;
  color: #fff;
  cursor: pointer;
  font-size: var(--iztro-star-font-size-small);
  font-weight: normal;
  white-space: nowrap;
  background-color: #ccc;
}

.iztro-palace-decadal-active {
  background-color: var(--iztro-color-decadal) !important;
}

.iztro-palace-yearly-active {
  background-color: var(--iztro-color-yearly) !important;
}

.iztro-palace-monthly-active {
  background-color: var(--iztro-color-monthly) !important;
}

.iztro-palace-daily-active {
  background-color: var(--iztro-color-daily) !important;
}

.iztro-palace-hourly-active {
  background-color: var(--iztro-color-hourly) !important;
}

.iztro-palace-footer {
  grid-area: ft;
  display: grid;
  grid-template-columns: auto auto auto;
  align-self: flex-start;
}

.iztro-palace-lft24 {
  text-align: left;
  font-size: var(--iztro-star-font-size-small);
  color: var(--iztro-color-decorator-1);
}

.iztro-palace-name {
  cursor: pointer;
  font-size: var(--iztro-star-font-size-small);
  font-weight: bold;
  color: var(--iztro-color-major);
}

.iztro-palace-name-wrapper {
  position: relative;
}

.iztro-palace-name-taichi {
  position: absolute;
  right: -15px;
  top: -2px;
}

.iztro-palace-name-body {
  font-weight: normal;
  color: var(--iztro-color-text);
}

.iztro-palace-scope {
  white-space: nowrap;
  text-align: center;
}

.iztro-palace-scope-age {
  color: var(--iztro-color-text);
  font-size: var(--iztro-star-font-size-small);
}

.iztro-palace-scope-decadal {
  font-weight: 700;
  color: var(--iztro-color-text);
}

.iztro-palace-rgt24 {
  text-align: right;
  font-size: var(--iztro-star-font-size-small);
  color: var(--iztro-color-decorator-2);
}

.iztro-palace-gz {
  cursor: pointer;
  text-align: right;
  font-size: var(--iztro-star-font-size-small);
  color: var(--iztro-color-major);
  transition: all 0.3s;
}

.iztro-palace-gz:hover {
  color: var(--iztro-color-active);
}

.iztro-palace-gz-active {
  background-color: var(--iztro-color-active);
  color: white;
  border-radius: 3px;
  padding: 1px 3px;
}

/* 星曜样式 - 对应react-iztro */
.iztro-star {
  position: relative;
  white-space: nowrap;
  display: inline-block;
  margin: 1px;
}

.iztro-star-major {
  font-size: var(--iztro-star-font-size-big);
  font-weight: bold;
  color: var(--iztro-color-major);
}

.iztro-star-soft {
  font-size: var(--iztro-star-font-size-small);
  font-weight: normal;
  color: var(--iztro-color-major);
}

.iztro-star-tough {
  font-size: var(--iztro-star-font-size-small);
  font-weight: normal;
  color: var(--iztro-color-tough);
}

.iztro-star-adjective {
  font-size: var(--iztro-star-font-size-small);
  font-weight: normal;
  color: var(--iztro-color-text);
  text-wrap: nowrap;
}

.iztro-star-flower {
  font-size: var(--iztro-star-font-size-small);
  font-weight: normal;
  color: var(--iztro-color-happy);
}

.iztro-star-helper {
  font-size: var(--iztro-star-font-size-small);
  font-weight: normal;
  color: var(--iztro-color-nice);
}

.iztro-star-tianma {
  font-size: var(--iztro-star-font-size-big);
  font-weight: bold;
  color: var(--iztro-color-active);
}

.iztro-star-lucun {
  font-size: var(--iztro-star-font-size-big);
  font-weight: bold;
  color: var(--iztro-color-awesome);
}

/* 四化样式 */
.iztro-star-mutagen {
  font-weight: normal;
  font-size: var(--iztro-star-font-size-small);
  border-radius: 4px;
  color: #fff;
  display: inline-block;
  margin-left: 1px;
  padding: 0 2px;
}

.star-with-mutagen {
  position: relative;
}

.star-with-mutagen::before {
  bottom: 0;
  content: " ";
  left: -4px;
  position: absolute;
  top: 0;
  width: 4px;
  transition: all 0.25s ease-in-out;
}

.iztro-star-mutagen.mutagen-0,
.star-with-mutagen.iztro-star-self-mutagen-0::before {
  background-color: var(--iztro-color-awesome);
}

.iztro-star-mutagen.mutagen-1,
.star-with-mutagen.iztro-star-self-mutagen-1::before {
  background-color: var(--iztro-color-quan);
}

.iztro-star-mutagen.mutagen-2,
.star-with-mutagen.iztro-star-self-mutagen-2::before {
  background-color: var(--iztro-color-nice);
}

.iztro-star-mutagen.mutagen-3,
.star-with-mutagen.iztro-star-self-mutagen-3::before {
  background-color: var(--iztro-color-focus);
}

/* 中央信息区 */
.palace-center {
  grid-area: ct;
  background: #f8f8f8;
  padding: 15px;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--iztro-color-border);
  overflow-y: auto;
  min-height: 200px;
}

.center-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.basic-info h3,
.horoscope-info h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #333;
}

.center-title {
  display: flex;
  align-items: center;
  gap: 5px;
}

.gender {
  font-size: 16px;
  font-weight: bold;
}

.gender-male {
  color: #1890ff;
}

.gender-female {
  color: #eb2f96;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  font-size: 10px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2px;
}

.info-item span {
  color: #666;
}

.info-item strong {
  color: #333;
}

.horoscope-date {
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}

.horoscope-date-single {
  display: flex;
  gap: 25px;
  font-size: 11px;
  color: #666;
  margin-bottom: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.date-item {
  white-space: nowrap;
}

.time-item {
  color: #999;
}

.today-mark {
  color: #1890ff;
  font-weight: bold;
  margin-left: 4px;
}

.horoscope-controls {
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: relative;
  z-index: 5;
}

.control-row {
  display: flex;
  gap: 4px;
  justify-content: center;
  flex-wrap: wrap;
}

.control-row-single {
  display: flex;
  gap: 3px;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
}

.ctrl-btn {
  padding: 4px 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 3px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 30px;
  position: relative;
  z-index: 10;
}

.ctrl-btn:hover {
  background: #e6f7ff;
  border-color: var(--iztro-color-active);
  color: var(--iztro-color-active);
  transform: translateY(-1px);
}

.ctrl-btn:active {
  background: var(--iztro-color-active);
  color: white;
  transform: translateY(0);
}

.time-display {
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: #333;
  padding: 5px;
}

.control-row-single .time-display {
  margin: 0 8px;
  padding: 4px 8px;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 11px;
  min-width: 40px;
  border: 1px solid #ddd;
}

/* 激活的运限显示 */
.active-scopes {
  margin: 10px 0;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.scope-indicator {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-size: 11px;
}

.scope-indicator:last-child {
  margin-bottom: 0;
}

.scope-decadal {
  color: var(--iztro-color-decadal);
  font-weight: bold;
}

.scope-yearly {
  color: var(--iztro-color-yearly);
  font-weight: bold;
}

.scope-monthly {
  color: var(--iztro-color-monthly);
  font-weight: bold;
}

.scope-daily {
  color: var(--iztro-color-daily);
  font-weight: bold;
}

.scope-hourly {
  color: var(--iztro-color-hourly);
  font-weight: bold;
}

.scope-palace {
  font-weight: normal;
  color: #666;
}

.powered-by {
  text-align: center;
  font-size: 10px;
  color: #999;
  margin-top: auto;
}

/* 底部信息 */
.bottom-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 15px 0;
  border-top: 1px solid #e0e0e0;
  font-size: 12px;
  color: #666;
}

.copyright {
  flex: 1;
}

.github-star {
  color: #f39c12;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1000px) {
  .main-content {
    flex-direction: column;
  }
  
  .left-panel {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
  }
  
  .iztro-astrolabe {
    font-size: 11px;
  }
  
  .iztro-star-major {
    font-size: 11px;
  }
  
  .iztro-star-soft,
  .iztro-star-tough,
  .iztro-star-adjective {
    font-size: 10px;
  }
}

@media (max-width: 600px) {
  .ziwei-container {
    padding: 10px;
  }
  
  .control-card {
    padding: 15px;
  }
  
  .iztro-astrolabe {
    grid-gap: 2px;
    font-size: 10px;
  }
  
  .iztro-palace {
    padding: 2px;
  }
  
  .iztro-star {
    font-size: 9px;
  }
  
  .basic-info h3,
  .horoscope-info h4 {
    font-size: 12px;
  }
  
  .info-grid {
    font-size: 10px;
  }
  
  .ctrl-btn {
    font-size: 9px;
    padding: 2px 4px;
  }
}

/* ===== 按照react-iztro标准的完整样式系统 ===== */
.iztro-palace-major {
  grid-area: major;
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.iztro-palace-minor {
  grid-area: minor;
  justify-self: center;
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.iztro-palace-adj {
  grid-area: adj;
  display: flex;
  flex-direction: column;
  justify-self: flex-end;
  gap: 2px;
  white-space: nowrap;
  text-align: right;
}

.iztro-palace-horo-star {
  grid-area: horo;
  align-self: center;
}

.iztro-palace-horo-star .stars {
  display: flex;
  gap: 3px;
}

.iztro-palace-scope {
  white-space: nowrap;
  text-align: center;
}

.iztro-palace-scope-decadal {
  font-weight: 700;
}

.iztro-palace-fate {
  grid-area: fate;
  align-self: flex-end;
  white-space: nowrap;
  justify-content: center;
  display: flex;
  gap: 3px;
  height: 17px;
}

.iztro-palace-fate .iztro-palace-decadal-active {
  background-color: var(--iztro-color-decadal);
}

.iztro-palace-fate .iztro-palace-yearly-active {
  background-color: var(--iztro-color-yearly);
}

.iztro-palace-fate .iztro-palace-monthly-active {
  background-color: var(--iztro-color-monthly);
}

.iztro-palace-fate .iztro-palace-daily-active {
  background-color: var(--iztro-color-daily);
}

.iztro-palace-fate .iztro-palace-hourly-active {
  background-color: var(--iztro-color-hourly);
}

.iztro-palace-footer {
  grid-area: ft;
  display: grid;
  grid-template-columns: auto auto auto;
  align-self: flex-start;
}

.iztro-palace-lft24 {
  text-align: left;
}

.iztro-palace-rgt24 {
  text-align: right;
}

.iztro-palace-name {
  cursor: pointer;
  text-wrap: nowrap;
}

.iztro-palace-name .iztro-palace-name-wrapper {
  position: relative;
}

.iztro-palace-name .iztro-palace-name-taichi {
  position: absolute;
  font-size: 12px;
  line-height: 14px;
  background-color: var(--iztro-color-major);
  padding: 0 2px;
  color: #fff;
  z-index: 2;
  border-radius: 0 4px 4px 0;
  font-weight: normal !important;
  bottom: 0;
}

.iztro-palace-gz {
  text-align: right;
  cursor: pointer;
}

.iztro-palace-gz span {
  display: inline-block;
  padding: 0 1px;
  text-wrap: nowrap;
}

.iztro-palace-dynamic-name {
  text-align: center;
  display: flex;
  white-space: nowrap;
  gap: 3px;
  justify-content: center;
}

.iztro-palace-dynamic-name .iztro-palace-dynamic-name-decadal {
  color: var(--iztro-color-decadal);
}

.iztro-palace-dynamic-name .iztro-palace-dynamic-name-yearly {
  color: var(--iztro-color-yearly);
}

.iztro-palace-dynamic-name .iztro-palace-dynamic-name-monthly {
  color: var(--iztro-color-monthly);
}

.iztro-palace-dynamic-name .iztro-palace-dynamic-name-daily {
  color: var(--iztro-color-daily);
}

.iztro-palace-dynamic-name .iztro-palace-dynamic-name-hourly {
  color: var(--iztro-color-hourly);
}

/* 星曜共通样式 */
.iztro-star {
  font-size: var(--iztro-star-font-size-small);
  font-weight: normal;
  text-wrap: nowrap;
  display: inline-block;
  margin: 1px;
}

.iztro-star-major {
  color: var(--iztro-color-major);
  font-weight: bold;
}

.iztro-star-soft,
.iztro-star-tough,
.iztro-star-adjective,
.iztro-star-flower,
.iztro-star-helper {
  color: var(--iztro-color-nice);
}

.iztro-palace-fate,
.iztro-palace-horo-star,
.iztro-palace-scope,
.iztro-palace-dynamic-name,
.iztro-palace-lft24,
.iztro-palace-rgt24 {
  font-size: var(--iztro-star-font-size-small);
  font-weight: normal;
  text-wrap: nowrap;
}

.iztro-palace-scope-age {
  text-wrap: balance;
}

.iztro-star-mutagen {
  font-weight: normal;
  font-size: var(--iztro-star-font-size-small);
  border-radius: 4px;
  color: #fff;
  display: inline-block;
  margin-left: 1px;
  padding: 0 2px;
}

.star-with-mutagen {
  position: relative;
}

.star-with-mutagen::before {
  bottom: 0;
  content: " ";
  left: -4px;
  position: absolute;
  top: 0;
  width: 4px;
  transition: all 0.25s ease-in-out;
}

.star-with-mutagen::after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: -4px;
  right: 0;
  height: 4px;
  transition: all 0.25s ease-in-out;
}
</style> 