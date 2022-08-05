<template>
  <RICPHeader></RICPHeader>
  <div class="bg-gray-900 min-h-screen">
    <div class="max-w-7xl m-auto">
      <RICPTabs></RICPTabs>
    </div>
  </div>
  <vue3-snackbar bottom :duration="3000"></vue3-snackbar>
</template>

<script setup lang="ts">
import RICPHeader from "./components/RICPHeader.vue";
import RICPTabs from "./components/RICPTabs.vue";
</script>
