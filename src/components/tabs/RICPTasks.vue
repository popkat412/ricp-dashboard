<template>
  <div>
    <div v-if="tasksStore.finishedInitialLoad">
      <RICPTaskEntries v-if="tasksStore.tasks.length > 0" :tasks="tasksStore.tasks">
      </RICPTaskEntries>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useTasksStore} from "../../stores/tasks.store";
import RICPTaskEntries from "./RICPTaskEntries.vue";

const tasksStore = useTasksStore();
</script>
