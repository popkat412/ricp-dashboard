<template>
  <div class="bg-sky-700 overflow-hidden">
    <div
      class="h-3 bg-sky-600"
      style="position: relative"
      :style="{
        width: `${width * 100}%`,
        left: `${pos * 100}%`,
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from "vue";

const pos = ref(0);
const width = ref(0.1);

// animate
let previousTimestamp = -1;
let stopAnimation = false;
let t = 0;

// i don't even remember what i was doing here with all this math
// i'll just never touch this again
const period = 1000;
const widthFn = (t: number) => Math.abs(0.5 * Math.sin(t * Math.PI));
const k = 2;
const posFn = (t: number) =>
  Math.pow(t % 1, k) / (Math.pow(t % 1, k) + Math.pow(1 - (t % 1), k));

const animate = (timestamp: number) => {
  if (stopAnimation) return;

  if (previousTimestamp != -1) {
    const deltaTime = timestamp - previousTimestamp; // in milliseconds
    width.value = widthFn(t);
    pos.value = posFn(t);
    t += deltaTime / period;
  }

  previousTimestamp = timestamp;
  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);

onUnmounted(() => {
  stopAnimation = true;
});
</script>
