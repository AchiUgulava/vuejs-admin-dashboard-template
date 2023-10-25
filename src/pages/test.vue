<template>
  <div class="flex h-screen overflow-hidden">

    <!-- Sidebar -->
    <Sidebar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />

    <!-- Content area -->
    <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

      <!-- Site header -->
      <Header :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main>
        <button @click.prevent="sendget()" class="p-10 bg-black m-10">
          click me
        </button>
        <button @click.prevent="sendpost()" class="p-10 bg-black m-10">
          click me
        </button>
      </main>

    </div>

  </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'
import { useMainStore } from "../stores/main.js"
import axios from 'axios'

import Sidebar from '../partials/Sidebar.vue'
import Header from '../partials/Header.vue'
const mainStore = useMainStore();
const userEngagement = ref(null)
const userActivity = ref(null)

onMounted(async () => {
  await mainStore.getTotalUsers();

  userEngagement.value = mainStore.main.userEngagement;
  userActivity.value = mainStore.main.usage;
});
const sendget = () => {
  const response = axios.get(
    'http://localhost:3000/users/countToday'

  ).then((r) => {
    if (r.data) {
      console.log(r.data);
    }
    else console.log('bleh');
  })
}
const sendpost = () => {
    const response = axios.post(
      'http://localhost:3000/users/getFiltered'
      , {
        sortby: {
          name: 'last_login',
          asc: true
        },
          page: 0
      }
    )
      .then((r) => {
        if (r.data) {
          console.log(r.data);
        }
        else console.log('bleh');
      }
      )
}
const sidebarOpen = ref(false)
</script>