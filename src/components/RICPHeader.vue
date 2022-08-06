<template>
  <header class="sticky top-0 z-30 bg-gray-900">
    <div
      class="flex items-center justify-between border-b border-gray-800 px-4 py-5 bg-opacity-50 backdrop-blur backdrop-filter text-slate-50"
    >
      <div>RICP Point System</div>
      <Popover v-if="!authStore.isAuthenticated" class="relative">
        <PopoverButton as="template" v-slot="{ open }"
          ><button
            :class="[
              open ? 'text-slate-50' : 'text-slate-50/50',
              'hover:text-slate-50',
            ]"
            @click="resetEverything"
          >
            Admin login
          </button></PopoverButton
        >
        <PopoverPanel class="absolute z-10 right-0 top-8">
          <div class="flex flex-col space-y-3 p-3 bg-gray-700 rounded-md w-64">
            <input
              type="text"
              placeholder="Email"
              v-model="email"
              :class="[
                'focus-ring p-2 rounded-sm bg-gray-800 border-2',
                invalidEmail ? 'border-rose-500' : 'border-slate-700',
              ]"
            />
            <input
              type="password"
              placeholder="Password"
              v-model="password"
              :class="[
                'focus-ring p-2 rounded-sm bg-gray-800 border-2',
                invalidPassword ? 'border-rose-500' : 'border-slate-700',
              ]"
              @keyup.enter="adminLogin"
            />
            <button
              class="focus-ring p-2 bg-gradient-to-br from-blue-800 to-blue-900 text-white/80 hover:text-white"
              @click="adminLogin"
            >
              Login
            </button>
          </div>
        </PopoverPanel>
      </Popover>
      <button
        v-else
        class="focus-ring text-slate-50/50 hover:text-slate-50"
        @click="signOut"
      >
        Sign Out
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { useSnackbar } from "vue3-snackbar";

import { useAuthStore } from "../stores/auth.store";

const authStore = useAuthStore();

const snackbar = useSnackbar();

// models
const email = ref("");
const password = ref("");

// validation
const invalidEmail = ref(false),
  invalidPassword = ref(false);

// reset stuff
const resetValidation = () => {
  invalidEmail.value = false;
  invalidPassword.value = false;
};
const resetInputs = () => {
  email.value = "";
  password.value = "";
};
const resetEverything = () => {
  resetValidation();
  resetInputs();
};

const adminLogin = async () => {
  console.log(email.value, password.value);

  // check empty
  resetValidation();
  if (email.value == "") invalidEmail.value = true;
  if (password.value == "") invalidPassword.value = true;
  if (invalidEmail.value || invalidPassword.value) return;

  // todo: loading indicator

  // try sign in
  const [, err] = await authStore.signIn(email.value, password.value);

  // helper functions
  const errFn = (text: string) =>
    snackbar.add({ type: "error", title: "Error", text });
  const setInvalidEmail = () => {
    invalidEmail.value = true;
    invalidPassword.value = false;
  };
  const setInvalidPassword = () => {
    invalidEmail.value = false;
    invalidPassword.value = true;
  };

  // success handling
  if (!err) {
    snackbar.add({ type: "success", title: `Logged in as ${email.value}` });
    resetEverything();
    return;
  }

  // error handling
  console.log(err?.code);
  if (err?.code == "auth/invalid-email") {
    setInvalidEmail();
    errFn("Invalid email");
  } else if (err?.code == "auth/user-not-found") {
    setInvalidEmail();
    errFn("User not found");
  } else if (
    err?.code == "auth/wrong-password" ||
    err?.code == "auth/invalid-password"
  ) {
    setInvalidPassword();
    errFn("Wrong password");
  }
};

const signOut = async () => {
  const err = await authStore.signOut();
  if (err) {
    snackbar.add({
      type: "error",
      title: "Error signing out",
      text: err.message, // yes yes i'm technically not supposed to show this to the user but whatever
    });
  } else {
    snackbar.add({ type: "success", title: "SIgned out successfully" });
  }
};
</script>
