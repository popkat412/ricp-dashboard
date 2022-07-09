<template>
  <table class="table-auto w-full overflow-x-auto min-w-[640px]">
    <thead class="text-left">
      <tr>
        <th>Time</th>
        <th>Change</th>
        <th v-if="'memberName' in $props.entries[0]">Name</th>
        <th>Message</th>
        <th>Admin</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(entry, idx) in $props.entries" :key="idx" class="h-10">
        <td class="flex space-x-5 h-10 items-center p-0">
          <div>
            {{ formatTimestamp(entry.timestamp) }}
          </div>
          <div class="w-5 self-stretch border-l-2 border-white relative">
            <div
              class="rounded-full w-3 h-3 border-white border-2 bg-gray-500 absolute top-2/4 left-0"
              style="transform: translate(calc(-50% - 0.5px), -50%)"
            ></div>
          </div>
        </td>
        <td>
          <strong>{{ formatChange(entry.change) }}</strong>
        </td>
        <td v-if="'memberName' in entry">
          <em>{{ entry.memberName }}</em>
        </td>
        <td>{{ entry.message }}</td>
        <td>
          <em>{{ entry.adminName }}</em>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import type { IHistoryEntry } from "../../types/IHistoryEntry";

defineProps<{
  entries: IHistoryEntry<"with member">[] | IHistoryEntry<"without member">[];
}>();

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
