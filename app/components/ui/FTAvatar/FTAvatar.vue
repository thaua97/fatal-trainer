<script setup lang="ts">
import { getInitialsFromName } from "#shared/utils/get-initials-from-name";

const props = withDefaults(
  defineProps<{
    name: string;
    src?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "hero" | "fill";
    monochrome?: boolean;
  }>(),
  {
    src: undefined,
    size: "md",
    monochrome: true,
  },
);

const imageError = ref(false);
const { toMediaUrl } = useMediaUrl();

watch(
  () => props.src,
  () => {
    imageError.value = false;
  },
);

const initials = computed(() => getInitialsFromName(props.name));
const resolvedSrc = computed(() => toMediaUrl(props.src));
const showImage = computed(() => Boolean(resolvedSrc.value) && !imageError.value);

function onImageError() {
  imageError.value = true;
}

const sizeClass = computed(() => {
  switch (props.size) {
    case "xs":
      return "size-12 text-sm rounded-xl";
    case "sm":
      return "size-10 text-sm rounded-full";
    case "md":
      return "size-[4.5rem] text-xl rounded-2xl";
    case "lg":
      return "size-[6.5rem] text-2xl rounded-2xl";
    case "xl":
      return "size-72 rounded-3xl text-4xl xl:size-80";
    case "2xl":
      return "size-90 rounded-4xl text-6xl";
    case "hero":
      return "h-80 w-full rounded-none text-5xl";
    case "fill":
      return "aspect-square w-full rounded-lg text-2xl";
    default:
      return "size-16 text-base rounded-2xl";
  }
});

const imageClass = computed(() => [
  sizeClass.value,
  props.monochrome ? "grayscale transition-all" : "",
]);

const isBlock = computed(() => props.size === "hero" || props.size === "fill");
</script>

<template>
  <img
    v-if="showImage"
    :src="resolvedSrc"
    :alt="`Foto de ${name}`"
    loading="lazy"
    class="shrink-0 object-cover"
    :class="imageClass"
    @error="onImageError"
  >
  <span
    v-else
    class="shrink-0 items-center justify-center font-semibold"
    :class="[isBlock ? 'flex' : 'inline-flex', sizeClass]"
    :style="{
      backgroundColor: 'var(--ft-primary-subtle)',
      color: 'var(--ft-primary)',
    }"
    :aria-label="`Avatar de ${name}`"
    role="img"
  >
    {{ initials }}
  </span>
</template>
