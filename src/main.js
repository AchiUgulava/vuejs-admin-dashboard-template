import { createApp } from 'vue'
import { createPinia } from "pinia";
import { useMainStore } from "./stores/main.js";
import axios from 'axios';
import router from './router'
import App from './App.vue'

import './css/style.css'

const pinia = createPinia();


const mainStore = useMainStore(pinia);
await mainStore.fetch("main")

const fetchCustomers = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_ENDPOINT + '/api/users';
      const response = await axios.post(apiUrl);
      mainStore.users = response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
await fetchCustomers()
mainStore.setDeviceType();

createApp(App).use(router).use(pinia).mount("#app");