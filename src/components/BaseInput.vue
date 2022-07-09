<template>
  <input
    :type="$props.type"
    :placeholder="$props.placeholder"
    @input="$emit('input', ($event.target as HTMLInputElement).value)"
    class="rounded-sm bg-gray-800 border-slate-700 p-2"
  />
</template>

<script setup lang="ts">
defineProps<{ type: string; placeholder?: string }>();
</script>
