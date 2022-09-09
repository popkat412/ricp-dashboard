<template>
  <div>
    <div v-if="pointsStore.finishedInitialLoad">
      <ol v-if="pointsStore.leaderboardEntries.length > 0">
        <!-- todo: show correct positions for ties -->
        <RICPLeaderboardEntry
          v-for="(entry, idx) in pointsStore.leaderboardEntries"
          :key="idx"
          :position="idx + 1"
          :leaderboard-entry="entry"
        ></RICPLeaderboardEntry>
      </ol>
      <div v-else>No members</div>
    </div>
    <div v-else>
      <BaseLoadingIndicator />
    </div>
  </div>
  <div class="w-full flex justify-center items-center">
    <button
      class="focus-ring p-1 rounded-sm bg-sky-800 mt-2"
      @click="addMemberModalOpen = true"
      v-if="authStore.isAuthenticated"
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
import { onErrorCaptured, ref } from "vue";

import RICPLeaderboardEntry from "./RICPLeaderboardEntry.vue";
import AddMemberModal from "../../modals/AddMemberModal.vue";
import BaseLoadingIndicator from "../../BaseLoadingIndicator.vue";

import { usePointsStore } from "../../../stores/points.store";
import { useAuthStore } from "../../../stores/auth.store";

const pointsStore = usePointsStore();
const authStore = useAuthStore();

const addMemberModalOpen = ref(false);
</script>
