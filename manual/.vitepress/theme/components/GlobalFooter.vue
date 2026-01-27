<template>
  <footer class="custom-footer">
    <div class="footer-container">
      <div class="footer-title">RedGPU API</div>
      <div class="footer-links">
        <a href="https://github.com/redcamel/RedGPU/releases" target="_blank">Latest Release</a>
        <a href="https://redcamel.github.io/RedGPU/examples/" target="_blank">Examples</a>
        <a href="https://github.com/redcamel/RedGPU/issues" target="_blank">Report Issue</a>
        <a href="https://github.com/redcamel/RedGPU" target="_blank">GitHub</a>
      </div>
      <div class="copyright">
        Copyright © 2019–present. This project is maintained by
        <a href="https://github.com/redcamel" target="_blank">redcamel</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* 기존에 작성했던 푸터 CSS를 여기로 옮겨오면 관리하기 훨씬 편합니다 */
.custom-footer {
  padding: 24px 24px;
  background-color: var(--vp-c-bg-alt);
  border-top: 1px solid var(--vp-c-gutter);
  text-align: center;
}
.footer-title {
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 12px;
}
.footer-links {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 16px;
}
.footer-links a {
  font-size: 0.9rem;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.copyright {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}
</style>