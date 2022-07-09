<template>
  <div class="w-full p-3">
    <TabGroup>
      <TabList class="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
        <Tab
          v-for="tabName in Object.keys(tabs)"
          as="template"
          :key="tabName"
          v-slot="{ selected }"
        >
          <button
            :class="[
              'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-50',
              'ring-offset-2 ring-offset-blue-900 focus:outline-none focus:ring-2',
              selected
                ? 'bg-gray-400/30 shadow'
                : 'text-blue-100 hover:bg-white/[0.05] hover:text-white',
            ]"
          >
            {{ tabName }}
          </button>
        </Tab>
      </TabList>

      <TabPanels class="mt-2 px-4">
        <TabPanel
          v-for="(componentName, idx) in Object.values(tabs)"
          :key="idx"
          class="text-slate-100"
        >
          <component :is="componentName"></component>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>

<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";

import RICPLeaderboard from "./tabs/RICPLeaderboard.vue";
import RICPProblemset from "./tabs/RICPProblemset.vue";
import RICPHistory from "./tabs/RICPHistory.vue";

const tabs = {
  Leaderboard: RICPLeaderboard,
  Problemset: RICPProblemset,
  History: RICPHistory,
};
</script>
