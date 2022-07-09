<template>
  <div class="w-full px-4 pt-2">
    <Disclosure v-slot="{ open }">
      <DisclosureButton
        class="flex w-full h-12 items-center rounded-lg bg-blue-100/10 px-4 py-2 text-left text-sm text-blue-100 hover:bg-blue-200/10 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
      >
        <span
          ><strong>#{{ $props.position }}</strong>
          {{ $props.leaderboardEntry.name }}
        </span>
        <div class="flex-grow"></div>
        <span>{{ $props.leaderboardEntry.points }} points</span>
        <ChevronUpIcon
          :class="open ? 'rotate-180 transform' : ''"
          class="h-5 w-5 ml-3 text-blue-100 bg-white/10 rounded-full"
        />
      </DisclosureButton>
      <DisclosurePanel
        class="px-4 py-4 text-sm text-blue-100 bg-white/[0.05] rounded-lg mt-1 mb-1 max-h-[50vh] overflow-scroll"
      >
        <ol
          v-for="(historyEntry, idx) in sortHistory(
            $props.leaderboardEntry.history
          )"
          :key="idx"
        >
          <RICPHistoryEntry :historyEntry="historyEntry"></RICPHistoryEntry>
        </ol>
      </DisclosurePanel>
    </Disclosure>
  </div>
</template>

<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronUpIcon } from "@heroicons/vue/solid";

import RICPHistoryEntry from "./RICPHistoryEntry.vue";
import type { IMember } from "../../types/IMember";
import type { IHistoryEntry } from "../../types/IHistoryEntry";

defineProps<{ position: number; leaderboardEntry: IMember }>();

const sortHistory = (history: IHistoryEntry[]) => {
  return [...history].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
};
</script>
