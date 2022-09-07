<template>
  <div ref="hoverTrigger" class="w-full pt-2">
    <Disclosure v-slot="{ open }">
      <DisclosureButton
        class="focus-ring flex w-full h-12 items-center rounded-lg bg-blue-100/10 px-4 py-2 text-left text-sm text-blue-100 hover:bg-blue-200/10"
      >
        <span
          ><strong>#{{ $props.position }}</strong>
          {{ $props.leaderboardEntry.name }}
        </span>
        <div class="flex-grow"></div>
        <button
          v-if="authStore.isAuthenticated && (isHovered || isFocused || open)"
          class="focus-ring mx-2 bg-sky-700 text-white p-1 rounded-sm"
          @click.stop="addPoints"
          @keyup.enter="addPoints"
        >
          Add Points
        </button>
        <span>{{ $props.leaderboardEntry.points }} points</span>
        <ChevronUpIcon
          :class="open ? 'rotate-180 transform' : ''"
          class="h-5 w-5 ml-3 text-blue-100 bg-white/10 rounded-full"
        />
      </DisclosureButton>
      <DisclosurePanel
        class="px-4 py-4 text-sm text-blue-100 bg-white/[0.05] rounded-lg mt-1 mb-1 max-h-[50vh] overflow-scroll"
      >
      <div class="my-1">
        <div v-if="sortedHistory.length > 0">
          <p class="mb-1"><strong>History</strong></p>
          <RICPHistoryEntries
            :entries="sortedHistory"
            :show-member-name="false"
          >
          </RICPHistoryEntries>
        </div>
        <div v-else><em>No history</em></div>
      </div>

      <div class="mb-1 mt-3">
        <div v-if="sortedTasks.length > 0">
          <p class="mb-1"><strong>Tasks completed</strong></p>
          <RICPTaskEntries :tasks="sortedTasks" :centre-align="false"></RICPTaskEntries>
        </div>
        <div v-else><em>No tasks completed</em></div>
      </div>
      </DisclosurePanel>
    </Disclosure>
  </div>
  <AddPointsModal
    :member-id="$props.leaderboardEntry.id"
    :member-name="$props.leaderboardEntry.name"
    :open="addPointsModalOpen"
    @close="addPointsModalOpen = false"
  >
  </AddPointsModal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Ref } from "vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronUpIcon } from "@heroicons/vue/20/solid";
import { useElementHover, useFocus } from "@vueuse/core";

import RICPHistoryEntries from "./RICPHistoryEntries.vue";
import RICPTaskEntries from "./RICPTaskEntries.vue";
import AddPointsModal from "../AddPointsModal.vue";
import { useAuthStore } from "../../stores/auth.store";

import type { Member } from "../../types/Member";

const $props = defineProps<{ position: number; leaderboardEntry: Member }>();

const authStore = useAuthStore();

const addPointsModalOpen = ref(false);
const hoverTrigger = ref() as Ref<HTMLElement>;

const isHovered = useElementHover(hoverTrigger);
const { focused: isFocused } = useFocus(hoverTrigger);

const sortedHistory = computed(() =>
  [...$props.leaderboardEntry.history].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  )
);

const sortedTasks = computed(() => [...$props.leaderboardEntry.tasksCompleted].sort((a, b)=> b.dateCompleted.getTime() - a.dateCompleted.getTime()));

const addPoints = () => {
  addPointsModalOpen.value = true;
};
</script>
