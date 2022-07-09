<template>
  <header class="sticky top-0 z-30 bg-gray-900">
    <div
      class="flex items-center justify-between border-b border-gray-800 px-4 py-5 bg-opacity-50 backdrop-blur backdrop-filter text-slate-50"
    >
      <div>RICP Point System</div>
      <button @click="adminLogin" class="text-slate-500 hover:text-slate-50">
        Admin login
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
const adminLogin = () => {
  // todo
};
</script>
