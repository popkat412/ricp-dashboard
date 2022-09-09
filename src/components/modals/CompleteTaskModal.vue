<!-- todo: refactor out a separate base modal component -->
<template>
  <div v-if="$props.task">
    <Modal
      :open="$props.open"
      @close="$emit('close')"
      :action-fn="markAsCompleted"
    >
      <template #title>
        Mark task "{{ $props.task.title }}" complete for member...
      </template>
      <template #content>
        <Combobox v-model="selectedMember">
          <div class="relative">
            <div class="relative">
              <ComboboxInput
                @change="query = $event.target.value"
                :display-value="member => (member as Member).name"
                class="w-full focus-ring p-2 rounded-sm bg-gray-900 focus:ring-2"
              />
              <ComboboxButton
                class="absolute inset-y-0 right-0 flex items-center pr-2"
              >
                <ChevronUpDownIcon
                  class="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </ComboboxButton>
            </div>

            <ComboboxOptions
              class="absolute w-full mt-1 max-h-60 bg-slate-900 shadow-lg"
            >
              <div
                v-if="filteredMembers.length == 0"
                class="relative select-none py-2 px-4 text-gray-400"
              >
                No member found
              </div>

              <ComboboxOption
                v-for="member in filteredMembers"
                :value="member"
                :key="member.id"
                v-slot="{ selected, active }"
              >
                <div
                  class="p-1 space-x-1 flex items-center cursor-pointer"
                  :class="{ 'bg-slate-600': active }"
                >
                  <div class="w-5 h-5">
                    <CheckIcon v-show="selected" />
                  </div>
                  <div>{{ member.name }}</div>
                </div>
              </ComboboxOption>
            </ComboboxOptions>
          </div>
        </Combobox>
      </template>
      <template #action-button>Mark as completed</template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  ComboboxButton,
} from "@headlessui/vue";
import { SnackbarOptions, useSnackbar } from "vue3-snackbar";
import { usePointsStore } from "../../stores/points.store";
import { Task } from "../../types/Task";
import { Member } from "../../types/Member";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import Modal from "./Modal.vue";

const $props = defineProps<{
  open: boolean;
  task: Task | null; // bruh I just remembered you can't use complex types here
}>();
const $emit = defineEmits<{
  (e: "close"): void;
}>();

const pointsStore = usePointsStore();
const snackbar = useSnackbar();

const query = ref("");

const dummyMember = new Member("dummy", "", []);
const selectedMember = ref(dummyMember);

const filteredMembers = computed(() =>
  pointsStore.members.filter(
    (member) =>
      !member.hasCompletedTask($props.task!) &&
      (query.value == ""
        ? true
        : member.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.value.toLowerCase().replace(/\s+/g, "")))
  )
);

const markAsCompleted = async (): Promise<
  [SnackbarOptions | undefined, boolean]
> => {
  if (selectedMember.value.name == "") {
    return [{ type: "error", title: "Member cannot be empty" }, true];
  }

  await pointsStore.addPoints({
    id: selectedMember.value.id,
    task: $props.task!,
  });

  return [
    {
      type: "success",
      title: `Successfully marked "${$props.task?.title}" as completed for member ${selectedMember.value.name}`,
    },
    false,
  ];
};
</script>
