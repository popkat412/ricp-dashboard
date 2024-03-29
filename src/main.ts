import { createApp } from "vue";
import { createPinia } from "pinia";
import { initializeApp as initializeFirebaseApp } from "firebase/app";

import "vue3-snackbar/dist/style.css";
import { SnackbarService, useSnackbar, Vue3Snackbar } from "vue3-snackbar";

import App from "./App.vue";
import "./index.css";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQqYtaXieMU9e0ZEVxIkmMh1ieR3aKbzY",
  authDomain: "ricp-points.firebaseapp.com",
  projectId: "ricp-points",
  storageBucket: "ricp-points.appspot.com",
  messagingSenderId: "80997449627",
  appId: "1:80997449627:web:ffd84151f74df1eed66b3e",
};

// Initialize Firebase
initializeFirebaseApp(firebaseConfig);

const pinia = createPinia();
const app = createApp(App);

// global error handler in case i missed anything
app.config.errorHandler = (err, instance, info) => {
  console.error("unexpected error", err, instance, info);
  const snackbar = useSnackbar();
  snackbar.add({
    type: "error",
    title: "An unexpected error occurred",
    text: "Please contact the site admins",
  });
};

app.use(SnackbarService);
app.component("vue3-snackbar", Vue3Snackbar);
app.use(pinia);
app.mount("#app");
