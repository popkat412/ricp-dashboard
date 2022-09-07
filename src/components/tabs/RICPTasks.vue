<template>
  <div>
    <div v-if="tasksStore.finishedInitialLoad">
      <RICPTaskEntries v-if="tasksStore.tasks.length > 0" :tasks="tasksStore.tasks">
      </RICPTaskEntries>
    </div>
  </div>
  <div class="w-full flex justify-center items-center">
    <button
      class="focus-ring p-1 rounded-sm bg-sky-800 mt-2"
      @click="addTaskModalOpen = true"
      v-if="authStore.isAuthenticated"
    >
      Add task
    </button>
  </div>

  
  <AddTaskModal
    :open="addTaskModalOpen"
    @close="addTaskModalOpen = false"
  ></AddTaskModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../../stores/auth.store";
import {useTasksStore} from "../../stores/tasks.store";
import RICPTaskEntries from "./RICPTaskEntries.vue";
import AddTaskModal from "../AddTaskModal.vue";

const tasksStore = useTasksStore();
const authStore = useAuthStore();

const addTaskModalOpen = ref(false);
</script>
