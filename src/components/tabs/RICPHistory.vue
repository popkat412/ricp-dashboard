<template>
  <div>
    <RICPHistoryEntries :entries="pointsStore.allHistory"> </RICPHistoryEntries>
  </div>
</template>

<script setup lang="ts">
import { usePointsStore } from "../../stores/points.store";
import RICPHistoryEntries from "./RICPHistoryEntries.vue";

const pointsStore = usePointsStore();
</script>
