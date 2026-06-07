<script setup lang="ts">
withDefaults(defineProps<{
  /** `fixed` covers the viewport; `contained` fills the nearest positioned ancestor */
  scope?: 'fixed' | 'contained'
}>(), {
  scope: 'fixed',
})
</script>

<template>
  <div
    :class="[
      $style.root,
      scope === 'contained' ? $style.contained : $style.fixed,
    ]"
    aria-hidden="true"
    data-testid="gradient-bubbles"
  >
    <div :class="[$style.bubble, $style.lavender, $style.lavenderPos]" />
    <div :class="[$style.bubble, $style.sky, $style.skyPos]" />
    <div :class="[$style.bubble, $style.pink, $style.pinkPos]" />
    <div :class="[$style.bubble, $style.violet, $style.violetPos]" />
  </div>
</template>

<style module>
.root {
  pointer-events: none;
  overflow: hidden;
}

.fixed {
  position: fixed;
  inset: 0;
  z-index: 0;
}

.contained {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.bubble {
  position: absolute;
  border-radius: 9999px;
  filter: blur(52px);
}

.lavender {
  background: #ddd6fe;
  opacity: 0.75;
}

.sky {
  background: #bae6fd;
  opacity: 0.65;
}

.pink {
  background: #fbcfe8;
  opacity: 0.6;
}

.violet {
  background: #c4b5fd;
  opacity: 0.7;
}

.lavenderPos {
  top: -2.5rem;
  left: -2.5rem;
  width: 12rem;
  height: 12rem;
}

.skyPos {
  top: 4rem;
  right: -1rem;
  width: 10rem;
  height: 10rem;
}

.pinkPos {
  bottom: 6rem;
  left: 28%;
  width: 13rem;
  height: 13rem;
}

.violetPos {
  right: 18%;
  bottom: 22%;
  width: 9rem;
  height: 9rem;
}
</style>
