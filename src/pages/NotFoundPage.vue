<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <div class="not-found-code">404</div>
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <RouterLink to="/dashboard" class="back-btn">Back to Dashboard</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.not-found-content {
  text-align: center;
  color: white;
}

.not-found-code {
  font-size: 120px;
  font-weight: 900;
  margin-bottom: 16px;
  opacity: 0.8;
}

h1 {
  margin: 0 0 12px;
  font-size: 42px;
  font-weight: 700;
}

p {
  margin: 0 0 32px;
  font-size: 16px;
  opacity: 0.9;
}

.back-btn {
  display: inline-block;
  padding: 12px 32px;
  background: white;
  color: #667eea;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.2s;
}

.back-btn:hover {
  transform: scale(1.05);
}
</style>
