<template>
  <div>
    <div v-if="tasksStore.finishedInitialLoad">
      <ol v-if="tasksStore.tasks.length > 0">
        <div v-for="(task, idx) in tasksStore.tasks" :key="idx">
          Title: {{ task.title }}, Description: {{ task.description }}, Date Added: {{ task.dateAdded }}, Expiry Date: {{ task.expiryDate }}, ScoreFnName: {{ task.scoreFnName }}
        </div>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useTasksStore} from "../../stores/tasks.store";

const tasksStore = useTasksStore();
</script>
