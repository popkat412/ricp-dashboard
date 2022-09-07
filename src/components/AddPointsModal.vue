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
        Add (or subtract) points to {{ $props.memberName }}
      </DialogTitle>
      <input
        type="text"
        placeholder="Amount (negative value subtracts points)"
        class="focus-ring p-2 rounded-sm bg-gray-900"
        v-model="amount"
      />
      <input
        type="text"
        placeholder="Message"
        class="focus-ring p-2 rounded-sm bg-gray-900"
        v-model="message"
      />

      <BaseLoadingIndicator
        :style="{ visibility: loading ? 'visible' : 'hidden' }"
      />

      <div class="flex justify-end flex-row space-x-1">
        <button class="focus-ring p-1 rounded-sm" @click="$emit('close')">
          Cancel
        </button>
        <button class="focus-ring p-1 rounded-sm bg-sky-700" @click="addPoints">
          Add points
        </button>
      </div>
    </DialogPanel>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useSnackbar } from "vue3-snackbar";

import BaseLoadingIndicator from "./BaseLoadingIndicator.vue";
import { usePointsStore } from "../stores/points.store";

const $props = defineProps<{
  open: boolean;
  memberName: string;
  memberId: string;
}>();
const $emit = defineEmits<{
  (e: "close"): void;
}>();

const pointsStore = usePointsStore();

const amount = ref("");
const message = ref("");
const loading = ref(false);

const snackbar = useSnackbar();

const addPoints = async () => {
  const parsedAmount = parseInt(amount.value, 10);

  if (isNaN(parsedAmount)) {
    snackbar.add({ type: "error", title: "Amount is not a valid integer" });
    return;
  }

  loading.value = true;

  const err = await pointsStore.addPoints({
    id: $props.memberId,
    change: parsedAmount,
    message: message.value
});
  if (err) {
    snackbar.add({ type: "error", title: "Error", text: err });
    return;
  }

  loading.value = false;
  $emit("close");
};
</script>
