<template>
  <div>
    <div v-if="tasksStore.finishedInitialLoad">
      <RICPTaskEntries
        v-if="tasksStore.tasks.length > 0"
        :tasks="tasksStore.tasks"
        :on-completed="onCompleted"
      >
      </RICPTaskEntries>
      <div v-else>No tasks</div>
    </div>
    <div v-else><BaseLoadingIndicator /></div>
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

  <CompleteTaskModal
    :open="completeTaskModalOpen"
    @close="closeCompleteTaskModal"
    :task="completeTaskModalTask"
  ></CompleteTaskModal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../../../stores/auth.store";
import { useTasksStore } from "../../../stores/tasks.store";
import RICPTaskEntries from "./RICPTaskEntries.vue";
import AddTaskModal from "../../modals/AddTaskModal.vue";
import { Task } from "../../../types/Task";
import CompleteTaskModal from "../../modals/CompleteTaskModal.vue";
import BaseLoadingIndicator from "../../BaseLoadingIndicator.vue";

const tasksStore = useTasksStore();
const authStore = useAuthStore();

const addTaskModalOpen = ref(false);

const completeTaskModalOpen = ref(false);
const completeTaskModalTask = ref<Task | null>(null);

const onCompleted = (task: Task) => {
  console.log("on completed", task);
  completeTaskModalOpen.value = true;
  completeTaskModalTask.value = task;
};
const closeCompleteTaskModal = () => {
  completeTaskModalOpen.value = false;
  completeTaskModalTask.value = null;
};
</script>
