<template>
  <Modal :open="$props.open" @close="$emit('close')" :action-fn="addMember">
    <template #title>Add a member</template>
    <template #content>
      <input
        type="text"
        placeholder="Name"
        class="focus-ring p-2 rounded-sm bg-gray-900 focus:ring-2"
        v-model="name"
      />
    </template>
    <template #action-button>Add member</template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SnackbarOptions } from "vue3-snackbar";
import { usePointsStore } from "../../stores/points.store";
import Modal from "./Modal.vue";

// unfortunately i don't think i can remove this duplication
const $props = defineProps<{
  open: boolean;
}>();
const $emit = defineEmits<{
  (e: "close"): void;
}>();

const pointsStore = usePointsStore();

const name = ref("");

const addMember = async (): Promise<[SnackbarOptions | undefined, boolean]> => {
  if (name.value == "") {
    return [{ type: "error", title: "Name cannot be empty" }, true];
  }

  await pointsStore.addMember(name.value);

  return [
    { type: "success", title: `Successfully added member ${name.value}` },
    false,
  ];
};
</script>
