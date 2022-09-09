<template>
  <Dialog
    :open="$props.open"
    @close="$emit('close')"
    class="fixed z-50 inset-0 overflow-auto bg-black/50"
  >
    <DialogPanel
      class="text-white flex flex-col justify-center p-4 bg-gray-800 max-w-sm mt-[15%] mx-auto space-y-3 drop-shadow-md"
    >
      <DialogTitle>
        <slot name="title"></slot>
      </DialogTitle>

      <slot name="content"></slot>

      <BaseLoadingIndicator
        :style="{ visibility: loading ? 'visible' : 'hidden' }"
      />

      <div class="flex justify-end flex-row space-x-1">
        <button class="focus-ring p-1 rounded-sm" @click="$emit('close')">
          Cancel
        </button>
        <button class="focus-ring p-1 rounded-sm bg-sky-700" @click="action">
          <slot name="action-button"></slot>
        </button>
      </div>
    </DialogPanel>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { SnackbarOptions, useSnackbar } from "vue3-snackbar";
import BaseLoadingIndicator from "../BaseLoadingIndicator.vue";

const $props = defineProps<{
  open: boolean;
  actionFn: () => Promise<[SnackbarOptions | undefined, boolean]>; // [snackbar data, keep modal open? ]
}>();
const $emit = defineEmits<{
  (e: "close"): void;
}>();

const snackbar = useSnackbar();

const loading = ref(false);

const action = async () => {
  loading.value = true;

  let snackbarOptions: SnackbarOptions | undefined, keepOpen: boolean;
  try {
    const [a, b] = await $props.actionFn();
    snackbarOptions = a;
    keepOpen = b;
  } catch (e) {
    snackbar.add({ type: "error", title: "Error", text: `${e}` });
    loading.value = false;
    return;
  }

  loading.value = false;

  if (snackbarOptions) {
    snackbar.add(snackbarOptions);
  }

  if (!keepOpen) $emit("close");
};
</script>
