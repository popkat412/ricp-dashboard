<template>
  <Modal :open="$props.open" @close="$emit('close')" :action-fn="addPoints">
    <template #title>
      Add (or subtract) points to {{ $props.memberName }}
    </template>
    <template #content>
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
    </template>
    <template #action-button>Add points</template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SnackbarOptions } from "vue3-snackbar";
import { usePointsStore } from "../../stores/points.store";
import Modal from "./Modal.vue";

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

const addPoints = async (): Promise<[SnackbarOptions | undefined, boolean]> => {
  const parsedAmount = parseInt(amount.value, 10);

  if (isNaN(parsedAmount)) {
    return [{ type: "error", title: "Amount is not a valid integer" }, true];
  }

  await pointsStore.addPoints({
    id: $props.memberId,
    change: parsedAmount,
    message: message.value,
  });

  return [
    {
      type: "success",
      title: `Added ${parsedAmount} points`,
    },
    false,
  ];
};
</script>
