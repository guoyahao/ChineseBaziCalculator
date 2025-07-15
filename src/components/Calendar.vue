<template>
  <div class="calendar">
    <div class="container">
      <h1 class="page-title">📅 福运万年历</h1>
      <p class="page-subtitle">天官赐福，查看农历、黄历宜忌，选择最佳福运时机</p>
      
      <div class="main-layout">
        <!-- 左侧日历区域 -->
        <div class="calendar-section">
          <div class="calendar-header">
            <button @click="previousMonth" class="nav-btn">‹</button>
            <div class="month-year">
              <h2>{{ currentDate.getFullYear() }}年{{ currentDate.getMonth() + 1 }}月</h2>
              <p class="lunar-month">{{ currentLunarInfo.year }}年{{ currentLunarInfo.month }}</p>
            </div>
            <button @click="nextMonth" class="nav-btn">›</button>
          </div>
          
          <div class="calendar-grid">
            <div class="weekdays">
              <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
            </div>
            
            <div class="days">
              <div 
                v-for="day in calendarDays" 
                :key="day.id"
                :class="getDayClass(day)"
                @click="selectDate(day)"
              >
                <div class="solar-date">{{ day.solar }}</div>
                <div class="lunar-date">{{ day.lunar }}</div>
                <div v-if="day.festival" class="festival">{{ day.festival }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧详细信息区域 -->
        <div class="detail-section">
          <div v-if="selectedDayInfo" class="detail-card">
            <div class="detail-header">
              <h3>{{ selectedDayInfo.solarDate }} {{ selectedDayInfo.weekday }}</h3>
              <div class="lunar-info">
                <p class="lunar-date-full">{{ selectedDayInfo.lunarDate }}</p>
                <p class="ganzhi-full">{{ selectedDayInfo.ganZhiFull }}</p>
              </div>
            </div>
            
            <div class="detailed-info">
              <div class="info-row">
                <div class="info-item">
                  <span class="label blue">宜</span>
                  <span class="content">{{ selectedDayInfo.suitable.join(' ') }}</span>
                </div>
              </div>
              <div class="info-row">
                <div class="info-item">
                  <span class="label red">忌</span>
                  <span class="content">{{ selectedDayInfo.avoid.join(' ') }}</span>
                </div>
              </div>
            </div>
            
            <div class="huangli-table">
              <div class="table-header">
                <div class="header-cell">纳音</div>
                <div class="header-cell">冲煞</div>
                <div class="header-cell">值神</div>
              </div>
              <div class="table-content">
                <div class="content-cell">{{ selectedDayInfo.nayin }}</div>
                <div class="content-cell">{{ selectedDayInfo.chongsha }}</div>
                <div class="content-cell">{{ selectedDayInfo.zhishen }}</div>
              </div>
            </div>
            
            <div class="additional-info">
              <div class="info-section">
                <h5>建除十二神</h5>
                <p class="build-remove">{{ selectedDayInfo.buildRemove }}</p>
              </div>
              <div class="info-section">
                <h5>二十八星宿</h5>
                <p class="star-constellation">{{ selectedDayInfo.constellation }}</p>
              </div>
              <div class="info-section">
                <h5>彭祖百忌</h5>
                <p class="pengzu">{{ selectedDayInfo.pengzu }}</p>
              </div>
            </div>
            
            <div class="time-analysis">
              <h4>时辰吉凶</h4>
              <div class="time-grid">
                <div v-for="time in selectedDayInfo.timeAnalysis" :key="time.time" 
                     :class="['time-item', time.luck]">
                  <div class="time-name">{{ time.time }}</div>
                  <div class="time-ganzhi">{{ time.ganzhi }}</div>
                  <div class="time-desc">{{ time.description }}</div>
                </div>
              </div>
            </div>
            
            <div class="divination-section">
              <h4>选择起卦方式</h4>
              <div class="divination-methods">
                <button @click="startTimeHexagram" class="method-btn">时间起卦</button>
                <button @click="startManualHexagram" class="method-btn">手动摇卦</button>
                <button @click="startNameHexagram" class="method-btn">姓名起卦</button>
                <button @click="startNumberHexagram" class="method-btn">数字起卦</button>
              </div>
            </div>
          </div>
          
          <div v-else class="no-selection">
            <div class="no-selection-content">
              <div class="calendar-icon">📅</div>
              <h3>请选择日期</h3>
              <p>点击左侧日历中的日期<br>查看详细的黄历信息</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calendar',
  data() {
    return {
      currentDate: new Date(),
      selectedDate: null,
      selectedDayInfo: null,
      weekdays: ['日', '一', '二', '三', '四', '五', '六'],
      currentLunarInfo: {
        year: '',
        month: ''
      },
      calendarDays: [],
      // 黄历数据
      huangliData: {
        suitable: [
          ['祭祀', '沐浴', '理发', '整手足甲', '修饰垣墙', '平治道涂', '除害虫取'],
          ['开市', '入宅', '出行', '修造', '词讼'],
          ['嫁娶', '纳采', '问名', '订盟', '冠笄', '会亲友'],
          ['安床', '合帐', '入殓', '移柩', '破土', '安葬'],
          ['祈福', '求嗣', '开光', '塑绘', '齐醮', '订盟'],
          ['造车器', '嫁娶', '订盟', '纳采', '会亲友', '祭祀'],
          ['沐浴', '剃头', '整手足甲', '扫舍', '塞穴', '平治道涂']
        ],
        avoid: [
          ['开市', '入宅', '出行', '修造', '词讼'],
          ['嫁娶', '纳采', '问名', '订盟', '冠笄', '会亲友'],
          ['安床', '合帐', '入殓', '移柩', '破土', '安葬'],
          ['祈福', '求嗣', '开光', '塑绘', '齐醮', '订盟'],
          ['造车器', '嫁娶', '订盟', '纳采', '会亲友', '祭祀'],
          ['沐浴', '剃头', '整手足甲', '扫舍', '塞穴', '平治道涂'],
          ['祭祀', '沐浴', '理发', '整手足甲', '修饰垣墙', '平治道涂']
        ]
      }
    }
  },
  mounted() {
    this.generateCalendar()
    this.getCurrentLunarInfo()
  },
  methods: {
    generateCalendar() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()
      
      // 获取当月第一天和最后一天
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      
      // 获取当月第一天是星期几
      const firstDayWeek = firstDay.getDay()
      
      const days = []
      
      // 添加上月末尾几天
      for (let i = firstDayWeek - 1; i >= 0; i--) {
        const date = new Date(year, month, -i)
        days.push(this.createDayObject(date, false))
      }
      
      // 添加当月所有天
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day)
        days.push(this.createDayObject(date, true))
      }
      
      // 添加下月开头几天，补足6行
      const remainingDays = 42 - days.length
      for (let day = 1; day <= remainingDays; day++) {
        const date = new Date(year, month + 1, day)
        days.push(this.createDayObject(date, false))
      }
      
      this.calendarDays = days
    },
    
    createDayObject(date, isCurrentMonth) {
      const lunarInfo = this.solarToLunar(date)
      const festival = this.getFestival(date, lunarInfo)
      
      return {
        id: date.toDateString(),
        date: new Date(date),
        solar: date.getDate(),
        lunar: lunarInfo.day === 1 ? lunarInfo.monthStr : lunarInfo.dayStr,
        isCurrentMonth,
        isToday: this.isToday(date),
        festival,
        lunarInfo
      }
    },
    
    solarToLunar(solarDate) {
      // 简化的农历转换算法
      const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', 
                          '七月', '八月', '九月', '十月', '十一月', '腊月']
      const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                        '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                        '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十']
      
      // 这里使用简化算法，实际应用中应该使用专业的农历库
      const dayOfYear = Math.floor((solarDate - new Date(solarDate.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24))
      const lunarMonth = Math.floor(dayOfYear / 30) % 12
      const lunarDay = (dayOfYear % 30) + 1
      
      return {
        year: solarDate.getFullYear(),
        month: lunarMonth + 1,
        day: lunarDay,
        monthStr: lunarMonths[lunarMonth],
        dayStr: lunarDays[Math.min(lunarDay - 1, 29)]
      }
    },
    
    getFestival(solarDate, lunarInfo) {
      const month = solarDate.getMonth() + 1
      const day = solarDate.getDate()
      
      // 阳历节日
      const solarFestivals = {
        '1-1': '元旦',
        '2-14': '情人节',
        '3-8': '妇女节',
        '5-1': '劳动节',
        '6-1': '儿童节',
        '10-1': '国庆节',
        '12-25': '圣诞节'
      }
      
      // 农历节日
      const lunarFestivals = {
        '1-1': '春节',
        '1-15': '元宵节',
        '5-5': '端午节',
        '8-15': '中秋节',
        '9-9': '重阳节'
      }
      
      const solarKey = `${month}-${day}`
      const lunarKey = `${lunarInfo.month}-${lunarInfo.day}`
      
      return solarFestivals[solarKey] || lunarFestivals[lunarKey] || null
    },
    
    getCurrentLunarInfo() {
      const lunarInfo = this.solarToLunar(this.currentDate)
      this.currentLunarInfo = {
        year: `农历${lunarInfo.year}年`,
        month: lunarInfo.monthStr
      }
    },
    
    isToday(date) {
      const today = new Date()
      return date.toDateString() === today.toDateString()
    },
    
    getDayClass(day) {
      return {
        'calendar-day': true,
        'current-month': day.isCurrentMonth,
        'other-month': !day.isCurrentMonth,
        'today': day.isToday,
        'selected': this.selectedDate && day.date.toDateString() === this.selectedDate.toDateString(),
        'has-festival': day.festival
      }
    },
    
    selectDate(day) {
      this.selectedDate = day.date
      this.generateDayDetail(day)
    },
    
    generateDayDetail(day) {
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      const ganZhiInfo = this.getDetailedGanZhi(day.date)
      
      // 根据日期获取宜忌
      const dayIndex = day.date.getDate() % this.huangliData.suitable.length
      
      this.selectedDayInfo = {
        solarDate: `${day.date.getFullYear()}年${day.date.getMonth() + 1}月${day.date.getDate()}日`,
        weekday: weekdays[day.date.getDay()],
        lunarDate: `农历${day.lunarInfo.monthStr}${day.lunarInfo.dayStr}`,
        ganZhiFull: ganZhiInfo.full,
        suitable: this.huangliData.suitable[dayIndex],
        avoid: this.huangliData.avoid[dayIndex],
        nayin: this.getNayin(ganZhiInfo.dayGanZhi),
        chongsha: this.getChongSha(ganZhiInfo.dayGanZhi),
        zhishen: this.getZhiShen(day.date),
        buildRemove: this.getBuildRemove(day.date),
        constellation: this.getConstellation(day.date),
        pengzu: this.getPengzu(ganZhiInfo.dayGanZhi),
        timeAnalysis: this.getTimeAnalysis(day.date)
      }
    },
    
    getDetailedGanZhi(date) {
      const gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
      const zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
      const zhiAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
      
      // 简化的干支计算
      const daysSince1900 = Math.floor((date - new Date(1900, 0, 1)) / (1000 * 60 * 60 * 24))
      
      // 年干支
      const year = date.getFullYear()
      const yearGanIndex = (year - 4) % 10
      const yearZhiIndex = (year - 4) % 12
      const yearGanZhi = `${gan[yearGanIndex]}${zhi[yearZhiIndex]}`
      const yearAnimal = zhiAnimals[yearZhiIndex]
      
      // 月干支
      const month = date.getMonth() + 1
      const monthGanIndex = ((year - 1900) * 12 + month - 1) % 10
      const monthZhiIndex = (month + 1) % 12
      const monthGanZhi = `${gan[monthGanIndex]}${zhi[monthZhiIndex]}`
      
      // 日干支
      const dayGanIndex = daysSince1900 % 10
      const dayZhiIndex = daysSince1900 % 12
      const dayGanZhi = `${gan[dayGanIndex]}${zhi[dayZhiIndex]}`
      
      return {
        full: `${yearGanZhi}(${yearAnimal})年 ${monthGanZhi}月 ${dayGanZhi}日`,
        yearGanZhi,
        monthGanZhi,
        dayGanZhi,
        yearAnimal
      }
    },
    
    getNayin(dayGanZhi) {
      const nayinTable = {
        '甲子': '海中金', '乙丑': '海中金', '丙寅': '炉中火', '丁卯': '炉中火',
        '戊辰': '大林木', '己巳': '大林木', '庚午': '路旁土', '辛未': '路旁土',
        '壬申': '剑锋金', '癸酉': '剑锋金', '甲戌': '山头火', '乙亥': '山头火',
        '丙子': '涧下水', '丁丑': '涧下水', '戊寅': '城头土', '己卯': '城头土',
        '庚辰': '白蜡金', '辛巳': '白蜡金', '壬午': '杨柳木', '癸未': '杨柳木',
        '甲申': '泉中水', '乙酉': '泉中水', '丙戌': '屋上土', '丁亥': '屋上土',
        '戊子': '霹雳火', '己丑': '霹雳火', '庚寅': '松柏木', '辛卯': '松柏木',
        '壬辰': '长流水', '癸巳': '长流水', '甲午': '砂中金', '乙未': '砂中金',
        '丙申': '山下火', '丁酉': '山下火', '戊戌': '平地木', '己亥': '平地木',
        '庚子': '壁上土', '辛丑': '壁上土', '壬寅': '金箔金', '癸卯': '金箔金',
        '甲辰': '覆灯火', '乙巳': '覆灯火', '丙午': '天河水', '丁未': '天河水',
        '戊申': '大驿土', '己酉': '大驿土', '庚戌': '钗钏金', '辛亥': '钗钏金',
        '壬子': '桑柘木', '癸丑': '桑柘木', '甲寅': '大溪水', '乙卯': '大溪水',
        '丙辰': '沙中土', '丁巳': '沙中土', '戊午': '天上火', '己未': '天上火',
        '庚申': '石榴木', '辛酉': '石榴木', '壬戌': '大海水', '癸亥': '大海水'
      }
      return nayinTable[dayGanZhi] || '未知'
    },
    
    getChongSha(dayGanZhi) {
      const chongTable = {
        '甲子': '冲马煞南', '乙丑': '冲羊煞东', '丙寅': '冲猴煞北', '丁卯': '冲鸡煞西',
        '戊辰': '冲狗煞南', '己巳': '冲猪煞东', '庚午': '冲鼠煞北', '辛未': '冲牛煞西',
        '壬申': '冲虎煞南', '癸酉': '冲兔煞东', '甲戌': '冲龙煞北', '乙亥': '冲蛇煞西',
        '丙子': '冲马煞南', '丁丑': '冲羊煞东', '戊寅': '冲猴煞北', '己卯': '冲鸡煞西',
        '庚辰': '冲狗煞南', '辛巳': '冲猪煞东', '壬午': '冲鼠煞北', '癸未': '冲牛煞西',
        '甲申': '冲虎煞南', '乙酉': '冲兔煞东', '丙戌': '冲龙煞北', '丁亥': '冲蛇煞西',
        '戊子': '冲马煞南', '己丑': '冲羊煞东', '庚寅': '冲猴煞北', '辛卯': '冲鸡煞西',
        '壬辰': '冲狗煞南', '癸巳': '冲猪煞东', '甲午': '冲鼠煞北', '乙未': '冲牛煞西',
        '丙申': '冲虎煞南', '丁酉': '冲兔煞东', '戊戌': '冲龙煞北', '己亥': '冲蛇煞西',
        '庚子': '冲马煞南', '辛丑': '冲羊煞东', '壬寅': '冲猴煞北', '癸卯': '冲鸡煞西',
        '甲辰': '冲狗煞南', '乙巳': '冲猪煞东', '丙午': '冲鼠煞北', '丁未': '冲牛煞西',
        '戊申': '冲虎煞南', '己酉': '冲兔煞东', '庚戌': '冲龙煞北', '辛亥': '冲蛇煞西',
        '壬子': '冲马煞南', '癸丑': '冲羊煞东', '甲寅': '冲猴煞北', '乙卯': '冲鸡煞西',
        '丙辰': '冲狗煞南', '丁巳': '冲猪煞东', '戊午': '冲鼠煞北', '己未': '冲牛煞西',
        '庚申': '冲虎煞南', '辛酉': '冲兔煞东', '壬戌': '冲龙煞北', '癸亥': '冲蛇煞西'
      }
      return chongTable[dayGanZhi] || '冲煞未知'
    },
    
    getZhiShen(date) {
      const zhishenList = ['明堂(吉)', '天刑', '朱雀', '金匮(吉)', '天德(吉)', '白虎', 
                          '玉堂(吉)', '天牢', '玄武', '司命(吉)', '勾陈', '青龙(吉)']
      const dayIndex = date.getDate() % zhishenList.length
      return zhishenList[dayIndex]
    },
    
    getBuildRemove(date) {
      const buildRemoveList = ['建', '除', '满', '平', '定', '执', '破', '危', '成', '收', '开', '闭']
      const descriptions = {
        '建': '建日可出行，不可动土',
        '除': '除日宜清洁，不宜嫁娶',
        '满': '满日宜祭祀，忌医疗',
        '平': '平日宜诸事，不宜争讼',
        '定': '定日宜签约，忌搬迁',
        '执': '执日宜婚姻，忌搬家',
        '破': '破日宜破土，忌开业',
        '危': '危日宜祈福，忌登高',
        '成': '成日宜开业，万事皆吉',
        '收': '收日宜收获，忌开启',
        '开': '开日宜开业，万事大吉',
        '闭': '闭日宜修养，忌开启'
      }
      const dayValue = date.getDate() % buildRemoveList.length
      const buildRemove = buildRemoveList[dayValue]
      return `${buildRemove} - ${descriptions[buildRemove]}`
    },
    
    getConstellation(date) {
      const constellations = [
        '角木蛟', '亢金龙', '氐土貉', '房日兔', '心月狐', '尾火虎', '箕水豹',
        '斗木獬', '牛金牛', '女土蝠', '虚日鼠', '危月燕', '室火猪', '壁水獝',
        '奎木狼', '娄金狗', '胃土雉', '昴日鸡', '毕月乌', '觜火猴', '参水猿',
        '井木犴', '鬼金羊', '柳土獐', '星日马', '张月鹿', '翼火蛇', '轸水蚓'
      ]
      const dayIndex = date.getDate() % constellations.length
      return constellations[dayIndex]
    },
    
    getPengzu(dayGanZhi) {
      const pengzuTable = {
        '甲子': '甲不开仓财物耗散 子不问卜自惹祸殃',
        '乙丑': '乙不栽植千株不长 丑不冠带主不还乡',
        '丙寅': '丙不修灶必见灾殃 寅不祭祀神鬼不尝',
        '丁卯': '丁不剃头头必生疮 卯不穿井水泉不香',
        '戊辰': '戊不受田田主不祥 辰不哭泣必主重丧',
        '己巳': '己不破券二比并亡 巳不远行财物伏藏',
        '庚午': '庚不经络织机虚张 午不苫盖屋主更张',
        '辛未': '辛不合酱主人不尝 未不服药毒气入肠'
      }
      return pengzuTable[dayGanZhi] || `${dayGanZhi.charAt(0)}不宜诸事 ${dayGanZhi.charAt(1)}不宜动作`
    },
    
    getTimeAnalysis(date) {
      const times = [
        { time: '子时', range: '23-01', ganzhi: '壬子', luck: 'good', desc: '吉神宜趋 天德合' },
        { time: '丑时', range: '01-03', ganzhi: '癸丑', luck: 'bad', desc: '凶神宜忌 血忌' },
        { time: '寅时', range: '03-05', ganzhi: '甲寅', luck: 'good', desc: '吉神宜趋 天恩' },
        { time: '卯时', range: '05-07', ganzhi: '乙卯', luck: 'neutral', desc: '平时 无特殊宜忌' },
        { time: '辰时', range: '07-09', ganzhi: '丙辰', luck: 'good', desc: '吉神宜趋 不将' },
        { time: '巳时', range: '09-11', ganzhi: '丁巳', luck: 'bad', desc: '凶神宜忌 天刑' },
        { time: '午时', range: '11-13', ganzhi: '戊午', luck: 'neutral', desc: '平时 诸事可为' },
        { time: '未时', range: '13-15', ganzhi: '己未', luck: 'good', desc: '吉神宜趋 天医' },
        { time: '申时', range: '15-17', ganzhi: '庚申', luck: 'bad', desc: '凶神宜忌 白虎' },
        { time: '酉时', range: '17-19', ganzhi: '辛酉', luck: 'neutral', desc: '平时 小心行事' },
        { time: '戌时', range: '19-21', ganzhi: '壬戌', luck: 'good', desc: '吉神宜趋 玉堂' },
        { time: '亥时', range: '21-23', ganzhi: '癸亥', luck: 'neutral', desc: '平时 宜静不宜动' }
      ]
      
      return times.map(time => ({
        time: time.time,
        ganzhi: time.ganzhi,
        luck: time.luck,
        description: time.desc
      }))
    },
    
    previousMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1)
      this.generateCalendar()
      this.getCurrentLunarInfo()
    },
    
    nextMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
      this.generateCalendar()
      this.getCurrentLunarInfo()
    },
    
    // 起卦方法
    startTimeHexagram() {
      this.$emit('start-hexagram', {
        method: 'time',
        date: this.selectedDate,
        info: this.selectedDayInfo
      })
    },
    
    startManualHexagram() {
      this.$emit('start-hexagram', {
        method: 'manual',
        date: this.selectedDate,
        info: this.selectedDayInfo
      })
    },
    
    startNameHexagram() {
      this.$emit('start-hexagram', {
        method: 'name',
        date: this.selectedDate,
        info: this.selectedDayInfo
      })
    },
    
    startNumberHexagram() {
      this.$emit('start-hexagram', {
        method: 'number',
        date: this.selectedDate,
        info: this.selectedDayInfo
      })
    }
  }
}
</script>

<style scoped>
.calendar {
  min-height: 100vh;
  color: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
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
  min-height: 600px;
}

.calendar-section {
  flex: 0 0 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.month-year {
  text-align: center;
}

.month-year h2 {
  margin: 0;
  font-size: 1.8rem;
}

.lunar-month {
  margin: 0.5rem 0 0 0;
  opacity: 0.8;
  font-size: 1rem;
}

.calendar-grid {
  width: 100%;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 1rem;
}

.weekday {
  text-align: center;
  padding: 1rem;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.calendar-day:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.calendar-day.current-month {
  background: rgba(255, 255, 255, 0.1);
}

.calendar-day.other-month {
  opacity: 0.5;
}

.calendar-day.today {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
}

.calendar-day.selected {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.calendar-day.has-festival {
  border: 2px solid #ffd700;
}

.solar-date {
  font-size: 1.2rem;
  font-weight: bold;
}

.lunar-date {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-top: 0.2rem;
}

.festival {
  font-size: 0.7rem;
  color: #ffd700;
  margin-top: 0.2rem;
  font-weight: bold;
}

.detail-section {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow-y: auto;
  max-height: 100%;
}

.detail-card {
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  height: 100%;
  overflow-y: auto;
}

.detail-header {
  text-align: center;
  margin-bottom: 2rem;
}

.detail-header h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.lunar-info {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f0f8ff;
  border-radius: 10px;
}

.lunar-date-full {
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  color: #667eea;
  font-weight: bold;
}

.ganzhi-full {
  margin: 0;
  color: #666;
  font-size: 1rem;
  font-weight: bold;
}

.detailed-info {
  margin-bottom: 2rem;
}

.info-row {
  margin: 1rem 0;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.label {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: bold;
  min-width: 30px;
  text-align: center;
  flex-shrink: 0;
}

.label.blue {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #2196f3;
}

.label.red {
  background: #ffebee;
  color: #d32f2f;
  border: 1px solid #f44336;
}

.content {
  flex: 1;
  line-height: 1.6;
  color: #333;
}

.huangli-table {
  margin: 2rem 0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.table-content {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background: #f8f9fa;
}

.header-cell, .content-cell {
  padding: 1.2rem;
  text-align: center;
  border-right: 1px solid rgba(255,255,255,0.2);
}

.header-cell:last-child, .content-cell:last-child {
  border-right: none;
}

.header-cell {
  font-weight: bold;
  font-size: 1.15rem;
}

.content-cell {
  color: #333;
  font-weight: 500;
  font-size: 1rem;
}

.additional-info {
  margin: 1.5rem 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.info-section {
  padding: 1.2rem;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

.info-section h5 {
  margin: 0 0 1rem 0;
  color: #4a5568;
  font-size: 1.1rem;
  font-weight: bold;
}

.build-remove, .star-constellation, .pengzu {
  margin: 0;
  color: #333;
  line-height: 1.6;
  font-size: 0.95rem;
}

.time-analysis {
  margin: 2rem 0;
}

.time-analysis h4 {
  color: #4a5568;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.6rem;
  max-height: 350px;
  overflow-y: auto;
}

.time-item {
  padding: 0.6rem;
  border-radius: 6px;
  text-align: center;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.time-item.good {
  background: #f0fff0;
  border-color: #4caf50;
}

.time-item.bad {
  background: #fff0f0;
  border-color: #f44336;
}

.time-item.neutral {
  background: #f8f9fa;
  border-color: #dee2e6;
}

.time-name {
  font-weight: bold;
  font-size: 0.95rem;
  margin-bottom: 0.3rem;
}

.time-ganzhi {
  color: #666;
  font-size: 0.75rem;
  margin-bottom: 0.3rem;
}

.time-desc {
  font-size: 0.65rem;
  color: #555;
  line-height: 1.2;
}

.divination-section {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.divination-section h4 {
  margin-bottom: 1rem;
  color: #4a5568;
}

.divination-methods {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.method-btn {
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.method-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.no-selection {
  text-align: center;
  padding: 2rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-selection-content {
  max-width: 300px;
  margin: 0 auto;
}

.calendar-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-selection h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.no-selection p {
  margin: 0;
  color: #666;
  font-size: 1rem;
}

@media (max-width: 1024px) {
  .main-layout {
    flex-direction: column;
    gap: 1.5rem;
    min-height: auto;
  }
  
  .calendar-section {
    flex: none;
  }
  
  .detail-section {
    flex: none;
    min-height: 400px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .main-layout {
    gap: 1rem;
  }
  
  .calendar-section {
    padding: 1rem;
  }
  
  .calendar-day {
    padding: 0.3rem;
  }
  
  .solar-date {
    font-size: 1rem;
  }
  
  .lunar-date {
    font-size: 0.7rem;
  }
  
  .festival {
    font-size: 0.6rem;
  }
  
  .detail-card {
    padding: 1rem;
  }
  
  .additional-info {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .time-grid {
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    gap: 0.5rem;
  }
  
  .additional-info {
    grid-template-columns: 1fr;
  }
  
  .divination-methods {
    flex-direction: column;
    align-items: center;
  }
}
</style> 