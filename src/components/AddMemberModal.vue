<!-- todo: refactor out a separate base modal component -->
<template>
  <Dialog
    :open="$props.open"
    @close="$emit('close')"
    class="fixed z-50 inset-0 overflow-auto bg-black/50"
  >
    <DialogPanel
      class="text-white flex flex-col justify-center p-4 bg-gray-800 max-w-sm mt-[15%] mx-auto space-y-3 drop-shadow-md"
    >
      <DialogTitle>Add a member</DialogTitle>
      <input
        type="text"
        placeholder="Name"
        class="focus-ring p-2 rounded-sm bg-gray-900 focus:ring-2"
        v-model="name"
      />

      <div class="flex justify-end flex-row space-x-1">
        <button class="focus-ring p-1 rounded-sm" @click="$emit('close')">
          Cancel
        </button>
        <button class="focus-ring p-1 rounded-sm bg-sky-700" @click="addMember">
          Add member
        </button>
      </div>
    </DialogPanel>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useSnackbar } from "vue3-snackbar";
import { usePointsStore } from "../stores/points.store";

const $props = defineProps<{
  open: boolean;
}>();
const $emit = defineEmits<{
  (e: "close"): void;
}>();

const pointsStore = usePointsStore();
const snackbar = useSnackbar();

const name = ref("");

const addMember = async () => {
  if (name.value == "") {
    snackbar.add({ type: "error", title: "Name cannot be empty" });
    return;
  }

  // todo: loading indicator

  const err = await pointsStore.addMember(name.value);
  if (err) {
    snackbar.add({ type: "error", title: "Error", text: err });
    return;
  }

  snackbar.add({
    type: "success",
    title: `Successfully added member ${name.value}`,
  });
  $emit("close");
};
</script>
