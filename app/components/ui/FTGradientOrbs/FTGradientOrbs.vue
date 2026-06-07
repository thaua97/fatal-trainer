<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'panel' | 'card' | 'header'
}>(), {
  variant: 'panel',
})
</script>

<template>
  <div
    :class="[$style.orbs, $style[variant]]"
    aria-hidden="true"
    data-testid="gradient-orbs"
  >
    <span :class="[$style.orb, $style.orbPrimary]" />
    <span :class="[$style.orb, $style.orbSecondary]" />
    <span :class="[$style.orb, $style.orbAccent]" />
  </div>
</template>

<style module>
.orbs {
  pointer-events: none;
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(64px);
}

.orbPrimary {
  background: radial-gradient(
    circle at 30% 30%,
    rgb(var(--ft-admin-orb-violet-rgb) / 0.35) 0%,
    transparent 70%
  );
}

.orbSecondary {
  background: radial-gradient(
    circle at 70% 60%,
    rgb(var(--ft-admin-orb-sky-rgb) / 0.28) 0%,
    transparent 70%
  );
}

.orbAccent {
  background: radial-gradient(
    circle at 50% 50%,
    rgb(var(--ft-admin-orb-peach-rgb) / 0.22) 0%,
    transparent 70%
  );
}

.panel .orbPrimary {
  width: 28rem;
  height: 28rem;
  top: -8rem;
  right: -6rem;
}

.panel .orbSecondary {
  width: 22rem;
  height: 22rem;
  bottom: -4rem;
  left: -4rem;
}

.panel .orbAccent {
  width: 16rem;
  height: 16rem;
  top: 40%;
  left: 35%;
}

.card .orbPrimary {
  width: 12rem;
  height: 12rem;
  top: -4rem;
  right: -2rem;
}

.card .orbSecondary {
  width: 10rem;
  height: 10rem;
  bottom: -3rem;
  left: -2rem;
}

.card .orbAccent {
  width: 6rem;
  height: 6rem;
  top: 20%;
  left: 55%;
}

.header .orbPrimary {
  width: 14rem;
  height: 14rem;
  top: -6rem;
  left: 50%;
  transform: translateX(-50%);
}

.header .orbSecondary {
  width: 10rem;
  height: 10rem;
  top: -2rem;
  right: -1rem;
}

.header .orbAccent {
  width: 8rem;
  height: 8rem;
  top: -3rem;
  left: -1rem;
}
</style>
