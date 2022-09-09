<!-- todo: refactor out a separate base modal component -->
<template>
  <Dialog
    :open="$props.open"
    class="fixed z-50 inset-0 overflow-auto bg-black/50"
    @keyup.esc="$emit('close')"
  >
    <DialogPanel
      class="text-white flex flex-col justify-center p-4 bg-gray-800 max-w-sm mt-[15%] mx-auto space-y-3 drop-shadow-md"
    >
      <DialogTitle>Add task</DialogTitle>
      <input
        type="text"
        placeholder="Title"
        class="focus-ring p-2 rounded-sm bg-gray-900 focus:ring-2"
        v-model="title"
      />

      <input
        type="text"
        placeholder="Description"
        class="focus-ring p-2 rounded-sm bg-gray-900 focus:ring-2"
        v-model="description"
      />

      <hr />

      <div>
        <label class="text-white/60">Expiry date (leave blank for none):</label>
        <input
          type="date"
          class="focus-ring p-2 rounded-sm bg-gray-900 focus:ring-2 w-full"
          v-model="expiryDate"
        />
      </div>

      <div>
        <label class="text-white/60">Score function:</label>
        <select
          class="focus-ring p-2 rounded-sm bg-gray-900 focus:ring-2 w-full"
          v-model="scoreFnName"
        >
          <option v-for="i in SCORE_FN_NAMES" :value="i">
            {{ capsFirstLetter(i) }}
          </option>
        </select>
      </div>

      <hr />

      <div>
        <label class="text-white/60">Start date:</label>
        <input
          type="date"
          class="focus-ring p-2 rounded-sm bg-gray-900 focus:ring-2 w-full"
          v-model="baseScoreFnParams.st"
        />
      </div>

      <div>
        <label class="text-white/60 inline-block w-1/2">Lower bound:</label>
        <input
          type="text"
          placeholder="Lower bound"
          class="focus-ring p-2 rounded-sm bg-gray-900 focus:ring-2 w-1/2"
          v-model="baseScoreFnParams.lb"
        />
      </div>

      <div>
        <label class="text-white/60 inline-block w-1/2">Upper bound:</label>
        <input
          type="text"
          placeholder="Upper bound"
          class="focus-ring p-2 rounded-sm bg-gray-900 focus:ring-2 w-1/2"
          v-model="baseScoreFnParams.ub"
        />
      </div>

      <hr />

      <div v-for="(_value, key) in extraScoreFnParams" :key="key">
        <label class="text-white/60 inline-block w-1/2">{{ key }}:</label>
        <input
          type="text"
          placeholder="Upper bound"
          class="focus-ring p-2 rounded-sm bg-gray-900 focus:ring-2 w-1/2"
          v-model="extraScoreFnParams[key]"
        />
      </div>

      <BaseLoadingIndicator
        :style="{ visibility: loading ? 'visible' : 'hidden' }"
      />

      <div class="flex justify-end flex-row space-x-1">
        <button class="focus-ring p-1 rounded-sm" @click="$emit('close')">
          Cancel
        </button>
        <button class="focus-ring p-1 rounded-sm bg-sky-700" @click="addMember">
          Add task
        </button>
      </div>
    </DialogPanel>
  </Dialog>
</template>

<script setup lang="ts">
import { Ref, ref, unref, watch } from "vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { useSnackbar } from "vue3-snackbar";
import BaseLoadingIndicator from "../BaseLoadingIndicator.vue";
import { useTasksStore } from "../../stores/tasks.store";
import { ScoreFnName, SCORE_FN_NAMES } from "../../types/ScoreFn";
import { start } from "repl";

const $props = defineProps<{
  open: boolean;
}>();
const $emit = defineEmits<{
  (e: "close"): void;
}>();

const tasksStore = useTasksStore();
const snackbar = useSnackbar();

const title = ref("");
const description = ref("");
const expiryDate = ref("");
const scoreFnName = ref<ScoreFnName>(SCORE_FN_NAMES[0]);
const baseScoreFnParams = ref({
  st: new Date().toLocaleDateString("en-CA"),
  lb: "0",
  ub: "999",
});
const extraScoreFnParams = ref<{ [k: string]: string }>({ c: "100" });

watch(scoreFnName, (newScoreFnName) => {
  switch (newScoreFnName) {
    case "constant":
      extraScoreFnParams.value = { c: "100" };
      break;
    case "linear":
      extraScoreFnParams.value = { c: "100", m: "10" };
      break;
    default:
      throw new Error(`unknown score fn name: ${newScoreFnName}`);
  }
});

const loading = ref(false);

// returns true if it passes validation, false otherwise
const validateNonEmpty = (v: Ref<string> | string, name: string) => {
  if (unref(v) == "") {
    snackbar.add({ type: "error", title: `${name} cannot be empty` });
    return false;
  }
  return true;
};
// returns the parsed int or null if not valid
const validateInt = (v: Ref<string> | string, name: string) => {
  const i = parseInt(unref(v), 10);
  if (isNaN(i)) {
    snackbar.add({ type: "error", title: `${name} is not an integer` });
    return null;
  }
  return i;
};
// returns the parsed date or null if not valid
// format should be YYYY-MM-DD
// technically this should never be invalid because date picker but you'll never know
const validateDate = (v: Ref<string> | string, name: string) => {
  const d = new Date(unref(v));
  if (isNaN(d.getTime())) {
    snackbar.add({
      type: "error",
      title: `${name} is not a valid date in format YYYY-MM-DD`,
    });
    return null;
  }
  return d;
};

const addMember = async () => {
  console.log({
    title: title.value,
    description: description.value,
    expiryDate: expiryDate.value,
    scoreFnName: scoreFnName.value,
    baseScoreFnParams: baseScoreFnParams.value,
    extraScoreFnParams: extraScoreFnParams.value,
  });

  // validation
  if (!validateNonEmpty(title, "Title")) return;
  if (!validateNonEmpty(description, "Description")) return;
  if (!validateNonEmpty(baseScoreFnParams.value.st, "Start date")) return;
  if (!validateNonEmpty(baseScoreFnParams.value.lb, "Lower bound")) return;
  if (!validateNonEmpty(baseScoreFnParams.value.ub, "Upper bound")) return;
  const lb = validateInt(baseScoreFnParams.value.lb, "Lower bound");
  if (lb == null) return;
  const ub = validateInt(baseScoreFnParams.value.ub, "Upper bound");
  if (ub == null) return;

  const parsedExtraScoreFnParams: { [k: string]: unknown } = {};

  switch (scoreFnName.value) {
    case "constant": {
      const c = validateInt(extraScoreFnParams.value.c, "c");
      if (c == null) return;
      parsedExtraScoreFnParams.c = c;
      break;
    }
    case "linear": {
      const c = validateInt(extraScoreFnParams.value.c, "c");
      if (c == null) return;
      const m = validateInt(extraScoreFnParams.value.m, "m");
      if (m == null) return;
      parsedExtraScoreFnParams.c = c;
      parsedExtraScoreFnParams.m = m;
      break;
    }
    default:
      throw new Error(`unknown score fn name: ${scoreFnName.value}`);
  }

  let parsedExpDate: Date | null = null;
  if (expiryDate.value) {
    const validateExpDate = validateDate(expiryDate, "Expiry Date");
    if (!validateExpDate) return;
    parsedExpDate = validateExpDate;
  }

  const st = validateDate(baseScoreFnParams.value.st, "Start date");
  if (!st) return;

  // finally done with validation
  const data = {
    title: title.value,
    description: description.value,
    dateAdded: new Date(),
    expiryDate: parsedExpDate,
    scoreFnName: scoreFnName.value,
    scoreFnParams: {
      st,
      lb,
      ub,
      ...parsedExtraScoreFnParams,
    },
    expired: false,
  };

  console.log(data);

  loading.value = true;

  try {
    await tasksStore.addTask(data);
  } catch (e) {
    snackbar.add({ type: "error", title: "Error", text: `${e}` });
    loading.value = false;
    return;
  }

  loading.value = false;
  snackbar.add({
    type: "success",
    title: `Successfully added task ${title.value}`,
  });
  $emit("close");
};

const capsFirstLetter = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
</script>
