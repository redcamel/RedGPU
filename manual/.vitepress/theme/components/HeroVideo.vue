<script setup>
// No withBase needed for external URLs
</script>

<template>
  <div class="VPHomeVideo">
    <div class="container">
      <div class="hero-video-container">
        <video 
          class="hero-video"
          autoplay 
          loop 
          muted 
          playsinline
          controls
        >
          <source src="https://github.com/user-attachments/assets/3115b699-9b3e-45f2-9e3b-682db04bcc03" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  </div>
</template>

<style scoped>
.VPHomeVideo {
  margin: 12px 24px;
}

.container {
  margin: 0 auto;
  max-width: 1152px;
}

.hero-video-container {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--vp-c-shadow-3);
  background: var(--vp-c-bg-soft);
}

.hero-video {
  width: 100%;
  height: auto;
  display: block;
}

@media (min-width: 640px) {
  .VPHomeVideo {
    padding: 0 48px;
    margin: 48px 0 0
  }
}

@media (min-width: 960px) {
  .VPHomeVideo {
    padding: 0 64px;
  }
}
</style>