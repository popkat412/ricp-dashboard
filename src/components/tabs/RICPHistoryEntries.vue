<template>
  <div class="w-full overflow-x-scroll">
    <table class="table-auto w-full min-w-[700px]">
      <thead class="text-left bg-gray-700">
        <tr>
          <th class="py-3 px-2">Time</th>
          <th class="py-3 pr-2">Change</th>
          <th class="py-3 pr-2" v-if="'memberName' in $props.entries[0]">
            Name
          </th>
          <th class="py-3 pr-2">Message</th>
          <th class="py-3 pr-2">Admin</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(entry, idx) in $props.entries"
          :key="idx"
          class="h-10 border-b border-b-white/10"
        >
          <td class="flex space-x-5 h-10 items-center">
            <div>
              {{ formatTimestamp(entry.timestamp) }}
            </div>
          </td>

          <td>
            <strong>{{ formatChange(entry.change) }}</strong>
          </td>

          <td v-if="'memberName' in entry">
            <em>{{ entry.memberName }}</em>
          </td>

          <td>
            {{ entry.message }}
          </td>

          <td>
            <em>{{ entry.adminName }}</em>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
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
