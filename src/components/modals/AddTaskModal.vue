<template>
  <Modal :open="$props.open" @close="$emit('close')" :action-fn="addTask">
    <template #title>Add task</template>
    <template #content>
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

      <!-- ok so i didn't have enough time to implement this so i just commented it out kekw -->
      <!-- <div>
        <label class="text-white/60">Expiry date (leave blank for none):</label>
        <input
          type="date"
          class="focus-ring p-2 rounded-sm bg-gray-900 focus:ring-2 w-full"
          v-model="expiryDate"
        />
      </div> -->

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

      <!-- todo: show score function options -->

      <hr />

      <!-- todo: put this in a disclosure -->
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
    </template>
    <template #action-button>Add task</template>
  </Modal>
</template>

<script setup lang="ts">
import { Ref, ref, unref, watch } from "vue";
import { Snackbar, SnackbarOptions, useSnackbar } from "vue3-snackbar";
import { useTasksStore } from "../../stores/tasks.store";
import { ScoreFnName, SCORE_FN_NAMES } from "../../types/ScoreFn";
import Modal from "./Modal.vue";

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

const addTask = async (): Promise<[SnackbarOptions | undefined, boolean]> => {
  // validation

  // in this case it's more convenient to show the snackbar via the validation function
  // rather than by returning it
  if (!validateNonEmpty(title, "Title")) return [undefined, true];
  if (!validateNonEmpty(baseScoreFnParams.value.st, "Start date"))
    return [undefined, true];
  if (!validateNonEmpty(baseScoreFnParams.value.lb, "Lower bound"))
    return [undefined, true];
  if (!validateNonEmpty(baseScoreFnParams.value.ub, "Upper bound"))
    return [undefined, true];
  const lb = validateInt(baseScoreFnParams.value.lb, "Lower bound");
  if (lb == null) return [undefined, true];
  const ub = validateInt(baseScoreFnParams.value.ub, "Upper bound");
  if (ub == null) return [undefined, true];

  const parsedExtraScoreFnParams: { [k: string]: unknown } = {};

  switch (scoreFnName.value) {
    case "constant": {
      const c = validateInt(extraScoreFnParams.value.c, "c");
      if (c == null) return [undefined, true];
      parsedExtraScoreFnParams.c = c;
      break;
    }
    case "linear": {
      const c = validateInt(extraScoreFnParams.value.c, "c");
      if (c == null) return [undefined, true];
      const m = validateInt(extraScoreFnParams.value.m, "m");
      if (m == null) return [undefined, true];
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
    if (!validateExpDate) return [undefined, true];
    parsedExpDate = validateExpDate;
  }

  const st = validateDate(baseScoreFnParams.value.st, "Start date");
  if (!st) return [undefined, true];

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

  await tasksStore.addTask(data);

  return [
    {
      type: "success",
      title: `Successfully added task ${title.value}`,
    },
    false,
  ];
};

const capsFirstLetter = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
</script>
