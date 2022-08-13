<template>
  <div>
    <ol v-if="pointsStore.leaderboardEntries.length > 0">
      <RICPLeaderboardEntry
        v-for="(entry, idx) in pointsStore.leaderboardEntries"
        :key="idx"
        :position="idx + 1"
        :leaderboardEntry="entry"
      ></RICPLeaderboardEntry>
    </ol>
    <div v-else>No members</div>
  </div>
  <div class="w-full flex justify-center items-center">
    <button
      class="focus-ring p-1 rounded-sm bg-sky-800 mt-2"
      @click="addMemberModalOpen = true"
    >
      Add member
    </button>
  </div>

  <AddMemberModal
    :open="addMemberModalOpen"
    @close="addMemberModalOpen = false"
  ></AddMemberModal>
</template>

<script setup lang="ts">
import { ref } from "vue";

import RICPLeaderboardEntry from "./RICPLeaderboardEntry.vue";
import AddMemberModal from "../AddMemberModal.vue";

import { usePointsStore } from "../../stores/points.store";

const pointsStore = usePointsStore();

const addMemberModalOpen = ref(false);
</script>
