<template>
  <header class="sticky top-0 z-30 bg-gray-900">
    <div
      class="flex items-center justify-between border-b border-gray-800 px-4 py-5 bg-opacity-50 backdrop-blur backdrop-filter text-slate-50"
    >
      <div>RICP Point System</div>
      <Popover v-if="!authStore.isSignedIn" class="relative">
        <PopoverButton as="template" v-slot="{ open }"
          ><button
            :class="[
              open ? 'text-slate-50' : 'text-slate-50/50',
              'hover:text-slate-50',
            ]"
          >
            Admin login
          </button></PopoverButton
        >
        <PopoverPanel class="absolute z-10 right-0 top-8">
          <div class="flex flex-col space-y-3 p-3 bg-gray-700 rounded-md w-64">
            <BaseInput type="text" placeholder="Email" v-model="email" />
            <BaseInput
              type="password"
              placeholder="Password"
              v-model="password"
            />
            <button
              class="p-2 bg-gradient-to-br from-blue-800 to-blue-900 text-white/80 hover:text-white"
              @click="adminLogin"
            >
              Login
            </button>
          </div>
        </PopoverPanel>
      </Popover>
      <button v-else @click="signOut">Signup</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";

import { useAuthStore } from "../stores/auth.store";
import BaseInput from "./BaseInput.vue";

const authStore = useAuthStore();

const email = ref("");
const password = ref("");

const adminLogin = () => {
  authStore.signIn(email.value, password.value);
};
const signOut = () => {
  // todo
  authStore.signOut();
};
</script>
