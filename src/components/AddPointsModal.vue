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
        class="focus-ring p-2 rounded-sm bg-gray-900 focus:ring-2"
        v-model="amount"
      />
      <input
        type="text"
        placeholder="Message"
        class="focus-ring p-2 rounded-sm bg-gray-900"
        v-model="message"
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

const snackbar = useSnackbar();

const addPoints = async () => {
  const parsedAmount = parseInt(amount.value, 10);

  if (isNaN(parsedAmount)) {
    snackbar.add({ type: "error", title: "Amount is not a valid integer" });
    return;
  }

  await pointsStore.addPoints($props.memberId, parsedAmount, message.value);

  $emit("close");
};
</script>
