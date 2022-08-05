declare module "vue3-snackbar" {
  import { Component, Plugin } from "vue";
  interface Snackbar {
    add(
      options: Partial<{
        type: "success" | "error" | "warning" | "info" | string;
        background: string;
        title: string;
        text: string;
        dismissible: boolean;
        icon: Object;
        groupKey: string;
      }>
    ): void;
    clear(): void;
  }
  export function useSnackbar(): Snackbar;
  export const Vue3Snackbar: Component;
  export const SnackbarService: Plugin;
}
