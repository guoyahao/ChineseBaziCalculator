<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-logo">🏮 天官赐福</router-link>
        <div class="nav-menu">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/bazi" class="nav-link">八字福运</router-link>
          <router-link to="/ziwei" class="nav-link">紫微斗数</router-link>
          <router-link to="/liuyao" class="nav-link">六爻占福</router-link>
          <router-link to="/enhanced-liuyao" class="nav-link">六爻增强版</router-link>
          <router-link to="/fishing-liuyao" class="nav-link">六爻钓鱼</router-link>
          <router-link to="/calendar" class="nav-link">福运万年历</router-link>
          <a href="https://github.com/guoyahao/ChineseBaziCalculator" target="_blank" class="nav-link github-link">
            <span class="github-icon">⭐</span>
            GitHub
          </a>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
    <footer class="footer">
      <div class="footer-content">
        <p>
          Copyright © 2020.北京天启博创科技有限公司 京ICP备20026966号-1 
          <span class="separator">|</span> 
          <a href="https://github.com/guoyahao/ChineseBaziCalculator" target="_blank" class="footer-github">
            🌟 开源项目
          </a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

#app::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 69, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(255, 140, 0, 0.08) 0%, transparent 50%),
    linear-gradient(45deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 69, 0, 0.05) 100%);
  z-index: -1;
  pointer-events: none;
}

.navbar {
  background: rgba(139, 69, 19, 0.2);
  backdrop-filter: blur(15px);
  padding: 0.8rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 4px 20px rgba(139, 69, 19, 0.3);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
}

.nav-logo {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffd700;
  text-decoration: none;
  text-shadow: 2px 2px 4px rgba(139, 69, 19, 0.8);
  transition: all 0.3s ease;
}

.nav-logo:hover {
  color: #ffed4e;
  transform: scale(1.05);
}

.nav-menu {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: #fff8dc;
  text-decoration: none;
  padding: 0.5rem 0.8rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.6);
  font-size: 0.95rem;
  white-space: nowrap;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(255, 215, 0, 0.3);
}

.github-link {
  background: rgba(0, 0, 0, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #e6e6e6 !important;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem !important;
  padding: 0.5rem 0.7rem !important;
}

.github-link:hover {
  background: rgba(0, 0, 0, 0.4) !important;
  color: #ffffff !important;
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.github-icon {
  font-size: 1.1rem;
  animation: twinkle 2s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.footer {
  background: rgba(139, 69, 19, 0.3);
  backdrop-filter: blur(15px);
  border-top: 1px solid rgba(255, 215, 0, 0.3);
  padding: 1rem 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 0 2rem;
}

.footer-content p {
  color: #fff8dc;
  font-size: 0.9rem;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.6);
  opacity: 0.9;
}

.separator {
  margin: 0 0.8rem;
  opacity: 0.6;
}

.footer-github {
  color: #ffd700;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.2rem 0.5rem;
  border-radius: 15px;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.footer-github:hover {
  color: #ffed4e;
  background: rgba(255, 215, 0, 0.1);
  transform: translateY(-1px);
}

@media (max-width: 1024px) {
  .nav-container {
    max-width: 100%;
    padding: 0 1rem;
  }
  
  .nav-menu {
    gap: 1rem;
  }
  
  .nav-link {
    font-size: 0.9rem;
    padding: 0.4rem 0.6rem;
  }
  
  .github-link {
    font-size: 0.85rem !important;
    padding: 0.4rem 0.6rem !important;
  }
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;
  }
  
  .nav-menu {
    gap: 0.8rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-link {
    font-size: 0.85rem;
    padding: 0.4rem 0.6rem;
  }
  
  .github-link {
    font-size: 0.8rem !important;
    padding: 0.4rem 0.6rem !important;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .footer-content {
    padding: 0 1rem;
  }
  
  .footer-content p {
    font-size: 0.8rem;
    line-height: 1.6;
  }
  
  .separator {
    display: block;
    margin: 0.3rem 0;
  }
  
  .footer-github {
    display: inline-block;
    margin-top: 0.3rem;
  }
}
</style> 