import { createApp } from "vue";
import { createPinia } from "pinia";
// Import the functions you need from the SDKs you need
import { initializeApp as initializeFirebaseApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
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
const firebaseApp = initializeFirebaseApp(firebaseConfig);

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.mount("#app");
