declare module "vue3-snackbar" {
  import { Component, Plugin } from "vue";
  interface Snackbar {
    add(options: SnackbarOptions): void;
    clear(): void;
  }
  export type SnackbarOptions = Partial<{
    type: "success" | "error" | "warning" | "info";
    background: string;
    title: string;
    text: string;
    dismissible: boolean;
    icon: Object;
    groupKey: string;
  }>;
  export function useSnackbar(): Snackbar;
  export const Vue3Snackbar: Component;
  export const SnackbarService: Plugin;
}
