<template>
  <!-- todo: make this responsive -->
  <div class="flex space-x-1 items-center">
    <div class="w-24 py-1">
      {{ formatTimestamp($props.historyEntry.timestamp) }}
    </div>
    <div class="w-5 self-stretch border-l-2 border-white relative">
      <div
        class="rounded-full w-3 h-3 border-white border-2 bg-gray-500 absolute top-2/4 left-0"
        style="transform: translate(calc(-50% - 0.5px), -50%)"
      ></div>
    </div>
    <div class="w-10">
      <strong>{{ formatChange($props.historyEntry.change) }}</strong>
    </div>
    <div>{{ $props.historyEntry.message }}</div>
    <div class="flex-grow"></div>
    <div>
      <em>{{ $props.historyEntry.adminName }}</em>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

import type { IHistoryEntry } from "../../types/IHistoryEntry";

defineProps<{ historyEntry: IHistoryEntry }>();

const formatTimestamp = (timestamp: Date) => {
  return dayjs(timestamp).format("D MMM YYYY\nhh:mm a");
};

const formatChange = (change: number) => {
  if (change > 0) {
    return `+${change}`;
  }
  return change;
};
</script>
