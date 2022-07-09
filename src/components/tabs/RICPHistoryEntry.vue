<template>
  <!-- todo: better history entry UI -->
  <div>
    {{ $props.historyEntry.change }}, {{ $props.historyEntry.message }},
    {{ $props.historyEntry.timestamp }}
  </div>
</template>

<script setup lang="ts">
import type { IHistoryEntry } from "../../types/IHistoryEntry";

defineProps<{ historyEntry: IHistoryEntry }>();
</script>
