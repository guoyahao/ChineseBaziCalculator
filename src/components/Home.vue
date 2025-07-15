<template>
  <div class="home">
    <div class="hero-section">
      <h1 class="hero-title">🏮 天官赐福</h1>
      <p class="hero-subtitle">天官降福，紫气东来，洞察命运玄机</p>
      <div class="features">

        <div class="feature-card" @click="$router.push('/bazi')">
          <div class="feature-icon">🎯</div>
          <h3>八字福运</h3>
          <p>天官赐福，根据出生年月日时，推算福运走势</p>
        </div>
        <div class="feature-card" @click="$router.push('/enhanced-liuyao')">
          <div class="feature-icon">☯️</div>
          <h3>六爻占福增强版</h3>
          <p>多种起卦方式：时间、姓名、数字、手动摇卦</p>
        </div>
        <div class="feature-card highlighted" @click="$router.push('/fishing-liuyao')">
          <div class="feature-icon">🎣</div>
          <h3>六爻钓鱼占卜</h3>
          <p>专业钓鱼占卜，九宫八卦图指引最佳钓点</p>
          <div class="new-badge">NEW</div>
        </div>
        <div class="feature-card" @click="$router.push('/calendar')">
          <div class="feature-icon">📅</div>
          <h3>福运万年历</h3>
          <p>查看农历、干支、宜忌，选择最佳福运时机</p>
        </div>
      </div>
    </div>
    
    <div class="contact-section">
      <h2>联系我们</h2>
      <p>天官赐福，专业福运咨询服务</p>
      <div class="contact-content">
        <div class="contact-info">
          <h3>🏮 天官赐福客服</h3>
          <p>• 专业八字福运分析师</p>
          <p>• 资深六爻占福专家</p>
          <p>• 24小时在线咨询服务</p>
          <p>• 个性化福运指导建议</p>
          <div class="contact-tips">
            <h4>💫 咨询须知：</h4>
            <p>1. 请提供准确的出生信息</p>
            <p>2. 诚心起卦，效果更佳</p>
            <p>3. 福运分析仅供参考</p>
            <p>4. 积极心态，创造美好未来</p>
          </div>
        </div>
        <div class="qrcode-container">
          <div class="qrcode-card">
            <img src="/qrcode.png" alt="天官赐福微信二维码" class="qrcode-image" @error="showPlaceholder = true" v-if="!showPlaceholder">
            <div class="qrcode-placeholder" v-else>
              <div class="qr-icon">📱</div>
              <p>微信二维码</p>
              <p class="qr-note">二维码加载失败<br>请检查 /public/qrcode.png 文件</p>
            </div>
            <p class="qrcode-text">扫码添加客服微信</p>
            <p class="qrcode-subtitle">一对一专业福运咨询</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="intro-section">
      <h2>关于我们</h2>
      <p>天官赐福，基于传统中华文化的命理方法，为您提供专业的福运分析服务。</p>
      <div class="intro-cards">

        <div class="intro-card">
          <h4>🏮 八字福运</h4>
          <p>天官赐福，八字福运是根据一个人出生的年、月、日、时所对应的天干地支来推断福运走向的传统命理学方法。</p>
        </div>
        <div class="intro-card">
          <h4>🎲 六爻占福</h4>
          <p>六爻占福是通过摇卦的方式，根据卦象的变化来预测福运发展趋势和结果的一种占卜方法，具有很强的实用性。</p>
        </div>
        <div class="intro-card">
          <h4>🎣 六爻钓鱼</h4>
          <p>专为钓鱼爱好者设计的占卜系统，结合方位学说和九宫八卦图，精准指引最佳钓点，提升钓鱼成功率。</p>
        </div>
        <div class="intro-card">
          <h4>📅 福运万年历</h4>
          <p>提供完整的万年历功能，包含农历、干支纪年、节气节日、黄历宜忌等信息，帮您选择最佳的福运时机。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      showPlaceholder: false
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.home::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 10% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 30%),
    radial-gradient(circle at 90% 80%, rgba(255, 140, 0, 0.1) 0%, transparent 30%),
    radial-gradient(circle at 30% 60%, rgba(255, 69, 0, 0.08) 0%, transparent 30%);
  pointer-events: none;
  z-index: -1;
}

.hero-section {
  text-align: center;
  padding: 4rem 0;
  color: white;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(139, 69, 19, 0.8);
  color: #ffd700;
  font-weight: bold;
  letter-spacing: 2px;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 3rem;
  color: #fff8dc;
  text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.6);
  font-weight: 500;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  background: rgba(139, 69, 19, 0.1);
  backdrop-filter: blur(15px);
  padding: 2rem;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 8px 32px rgba(139, 69, 19, 0.1);
}

.feature-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 215, 0, 0.15);
  box-shadow: 0 20px 40px rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.6);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.feature-card.highlighted {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px solid #ffd700;
  position: relative;
}

.new-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #ff6b6b;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.intro-section {
  background: rgba(255, 255, 255, 0.95);
  padding: 4rem 2rem;
  border-radius: 20px;
  margin: 2rem 0;
  color: #333;
}

.intro-section h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #4a5568;
}

.intro-section > p {
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 3rem;
  color: #666;
}

.intro-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.intro-card {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffd700 100%);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(139, 69, 19, 0.3);
  border: 1px solid rgba(255, 215, 0, 0.4);
}

.intro-card h4 {
  font-size: 1.3rem;
  margin-bottom: 1rem;
}

.intro-card p {
  line-height: 1.6;
}

.contact-section {
  background: rgba(255, 255, 255, 0.95);
  padding: 4rem 2rem;
  border-radius: 20px;
  margin: 2rem 0;
  color: #333;
}

.contact-section h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #4a5568;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-section > p {
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 3rem;
  color: #666;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.contact-info {
  padding: 2rem;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(247, 147, 30, 0.1) 100%);
  border-radius: 15px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.contact-info h3 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #ff6b35;
  text-align: center;
}

.contact-info p {
  margin: 0.8rem 0;
  color: #555;
  font-size: 1rem;
  line-height: 1.6;
}

.contact-tips {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 10px;
  border-left: 4px solid #ffd700;
}

.contact-tips h4 {
  margin: 0 0 1rem 0;
  color: #f7931e;
  font-size: 1.1rem;
}

.contact-tips p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
}

.qrcode-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.qrcode-card {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(255, 107, 53, 0.2);
  border: 2px solid rgba(255, 215, 0, 0.4);
  position: relative;
  transition: all 0.3s ease;
}

.qrcode-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(255, 107, 53, 0.3);
}

.qrcode-card::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #ff6b35, #f7931e, #ffd700);
  border-radius: 22px;
  z-index: -1;
}

.qrcode-image {
  width: 220px;
  height: auto;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.qrcode-placeholder {
  width: 220px;
  height: 220px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px dashed #dee2e6;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  text-align: center;
}

.qr-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.qrcode-placeholder p {
  margin: 0.5rem 0;
  color: #666;
  font-size: 1rem;
}

.qr-note {
  font-size: 0.8rem !important;
  color: #999 !important;
  line-height: 1.4;
}

.qrcode-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ff6b35;
  margin: 1rem 0 0.5rem 0;
}

.qrcode-subtitle {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
  
  .intro-cards {
    grid-template-columns: 1fr;
  }
  
  .intro-section {
    padding: 2rem 1rem;
  }
  
  .contact-section {
    padding: 2rem 1rem;
  }
  
  .contact-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .qrcode-image {
    width: 180px;
  }
  
  .qrcode-placeholder {
    width: 180px;
    height: 180px;
  }
  
  .contact-info {
    padding: 1.5rem;
  }
  
  .contact-tips {
    padding: 1rem;
  }
}
</style> 