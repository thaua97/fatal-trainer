<template>
  <div class="relative h-20 overflow-hidden">
    <FTGradientOrbs variant="header" />
    <div :class="$style.headerGradient" />
    <div
      :class="$style.headerSparkle"
      aria-hidden="true"
    />
  </div>
</template>

<style module>
.headerGradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom right,
    rgb(139 92 246 / 0.8),
    rgb(167 139 250 / 0.7),
    rgb(56 189 248 / 0.6)
  );
}

.headerSparkle {
  position: absolute;
  inset: 0;
  opacity: 0.4;
  background-image:
    radial-gradient(circle at 20% 30%, rgb(255 255 255 / 0.45) 0, transparent 45%),
    radial-gradient(circle at 80% 70%, rgb(255 255 255 / 0.25) 0, transparent 40%);
}
</style>
