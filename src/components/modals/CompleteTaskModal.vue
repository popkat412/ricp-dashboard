<!-- todo: refactor out a separate base modal component -->
<template>
  <Dialog :open="$props.open" @close="$emit('close')" class="fixed z-50 inset-0 overflow-auto bg-black/50"
    v-if="$props.task">
    <DialogPanel
      class="text-white flex flex-col justify-center p-4 bg-gray-800 max-w-sm mt-[15%] mx-auto space-y-3 drop-shadow-md">
      <DialogTitle>Mark task "{{ $props.task.title }}" complete for member...</DialogTitle>

      <Combobox v-model="selectedMember">
        <div class="relative">
          <div class="relative">
            <ComboboxInput @change="query = $event.target.value" :display-value="member => (member as Member).name"
              class="w-full focus-ring p-2 rounded-sm bg-gray-900 focus:ring-2" />
            <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </ComboboxButton>
          </div>

          <ComboboxOptions class="absolute w-full mt-1 max-h-60 bg-slate-900 shadow-lg">
            <div v-if="filteredMembers.length == 0" class="relative select-none py-2 px-4 text-gray-400">
              No member found
            </div>

            <ComboboxOption v-for="member in filteredMembers" :value="member" :key="member.id"
              v-slot="{ selected, active }">
              <div class="p-1 space-x-1 flex items-center cursor-pointer" :class="{'bg-slate-600': active}">
                <div class="w-5 h-5">
                  <CheckIcon v-show="selected" />
                </div>
                <div> {{ member.name }} </div>
              </div>
            </ComboboxOption>
          </ComboboxOptions>
        </div>
      </Combobox>

      <BaseLoadingIndicator :style="{ visibility: loading ? 'visible' : 'hidden' }" />

      <div class="flex justify-end flex-row space-x-1">
        <button class="focus-ring p-1 rounded-sm" @click="$emit('close')">
          Cancel
        </button>
        <button class="focus-ring p-1 rounded-sm bg-sky-700" @click="markAsCompleted">
          Mark as completed
        </button>
      </div>
    </DialogPanel>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Dialog, DialogPanel, DialogTitle, Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, ComboboxButton } from "@headlessui/vue";
import { useSnackbar } from "vue3-snackbar";
import { usePointsStore } from "../../stores/points.store";
import BaseLoadingIndicator from "../BaseLoadingIndicator.vue";
import { Task } from "../../types/Task";
import { Member } from "../../types/Member";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";


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
const selectedMember= ref(dummyMember);

const filteredMembers = computed(() => 
  pointsStore.members.filter((member) => !member.hasCompletedTask($props.task!) && (query.value == "" ? true : member.name.toLowerCase().replace(/\s+/g, '').includes(query.value.toLowerCase().replace(/\s+/g, ''))))
);

const loading = ref(false);

const markAsCompleted = async () => {
  if (selectedMember.value.name == "") {
    snackbar.add({ type: "error", title: "Member cannot be empty" });
    return;
  }

  loading.value = true;

  const err = await pointsStore.addPoints({ id: selectedMember.value.id, task: $props.task! });
  if (err) {
    snackbar.add({ type: "error", title: "Error", text: err });
    return;
  }

  loading.value = false;
  snackbar.add({
    type: "success",
    title: `Successfully completed task ${$props.task?.title} for member ${selectedMember.value.name}`,
  });
  $emit("close");
};
</script>
