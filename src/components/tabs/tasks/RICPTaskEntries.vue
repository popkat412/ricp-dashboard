<template>
  <div class="grid gap-3 grid-cols-[repeat(auto-fit,_minmax(0,_20rem))]" :class="[$props.centreAlign ? 'justify-center' : '']">
    <div
      class="focus-ring flex flex-col justify-items-stretch items-center rounded-lg bg-blue-100/10 p-3 text-left text-blue-100"
      v-for="(task, idx) in $props.tasks" :key="idx">

      <div class="w-full">
        <div class="flex flex-row">
          <div class="flex flex-col">
            <h1 class="text-xl font-semibold">{{ getTitle(task) }}</h1>
            <p class="text-md">{{ getDescription(task) }}</p>
          </div>
          <div class="flex-grow"></div>
          <div class="flex flex-col">
            <div class="text-centre text-2xl font-bold">{{ getScore(task) }}</div>
            <div>points</div>
          </div>
        </div>
        <div class="flex flex-row">
          <div>
            <div v-if="'dateCompleted' in task">
              <em>Completed {{ task.dateCompleted.toLocaleDateString() }}</em>
            </div>
            <div class="text-white/50 mt-1">
              <div>
                Score function: {{ getScoreFnName(task) }}
              </div>
              <div>
                Date added: {{ getDateAdded(task) }}
              </div>
              <div>
                Expiry date: {{ getExpiryDate(task) }}
              </div>
            </div>
          </div>
          <div class="flex-grow"></div>
          <div class="relative">
            <button 
              v-if="$props.onCompleted && authStore.isAuthenticated" 
              class="absolute bottom-0 right-0" 
              @click="$props.onCompleted!(task instanceof Task ? task : task.task)"
              title="Mark as completed for member"
            >
              <CheckCircleIcon class="text-slate-100 h-10 w-10"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TaskCompleted } from '../../../types/Member';
import { Task } from '../../../types/Task';
import { CheckCircleIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from '../../../stores/auth.store';

withDefaults(defineProps<{ tasks: Task[] | TaskCompleted[]; centreAlign?: boolean; onCompleted?: (task: Task) => void}>(), {centreAlign: true});

const authStore = useAuthStore();

const getTitle = (task: Task | TaskCompleted) => task instanceof Task ? task.title : task.task.title;
const getDescription = (task: Task | TaskCompleted) => task instanceof Task ? task.description : task.task.description;
const getScoreFnName = (task: Task | TaskCompleted) => task instanceof Task ? task.scoreFnName : task.task.scoreFnName;
const getScore = (task: Task | TaskCompleted) => task instanceof Task ? task.getScore(new Date()) : task.task.getScore(task.dateCompleted);
const getDateAdded = (task: Task | TaskCompleted) => task instanceof Task ? task.dateAdded.toLocaleDateString() : task.task.dateAdded.toLocaleDateString();
const getExpiryDate = (task: Task | TaskCompleted) => (task instanceof Task ? task.expiryDate : task.task.expiryDate)?.toLocaleDateString() ?? "None";


</script>