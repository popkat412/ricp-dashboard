<template>
  <div>
    <ol v-for="(entry, idx) in pointsStore.leaderboardEntries" :key="idx">
      <RICPLeaderboardEntry
        :position="idx + 1"
        :leaderboardEntry="entry"
      ></RICPLeaderboardEntry>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { usePointsStore } from "../../stores/points.store";
import RICPLeaderboardEntry from "./RICPLeaderboardEntry.vue";

const pointsStore = usePointsStore();
</script>
