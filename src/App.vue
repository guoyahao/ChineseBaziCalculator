<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-logo">🏮 天官赐福</router-link>
        <div class="nav-menu">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/bazi" class="nav-link">八字福运</router-link>
          <router-link to="/liuyao" class="nav-link">六爻占福</router-link>
          <router-link to="/enhanced-liuyao" class="nav-link">六爻增强版</router-link>
          <router-link to="/fishing-liuyao" class="nav-link">六爻钓鱼</router-link>
          <router-link to="/calendar" class="nav-link">福运万年历</router-link>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
    <footer class="footer">
      <div class="footer-content">
        <p>Copyright © 2020.北京天启博创科技有限公司 京ICP备20026966号-1</p>
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
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 4px 20px rgba(139, 69, 19, 0.3);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
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
  gap: 2rem;
}

.nav-link {
  color: #fff8dc;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.6);
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(255, 215, 0, 0.3);
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

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-menu {
    gap: 1rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .footer-content {
    padding: 0 1rem;
  }
  
  .footer-content p {
    font-size: 0.8rem;
  }
}
</style> 