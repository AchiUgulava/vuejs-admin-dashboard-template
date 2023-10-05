<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <Sidebar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />

    <!-- Content area -->
    <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <!-- Site header -->
      <Header :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main>
        <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <div v-if="userData">
            <!-- Display user data here -->
            <UserCard :userData="userData"/>
            <!-- Add more user information as needed -->
            <List v-if="userChats" :usr="userData.id" :chats="userChats"/>
            <div v-else>
              <p>Loading...</p>
            </div>
          </div>
          <div v-else>
            <p>Loading...</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { useMainStore } from "../stores/main.js";
import { useRoute } from "vue-router"; // Import useRoute from Vue Router
import Sidebar from '../partials/Sidebar.vue';
import Header from '../partials/Header.vue';
import axios from 'axios';
import List from '../partials/user/List.vue';
import UserCard from '../partials/user/UserCard.vue'
const mainstore = useMainStore();

// Define a ref for user data
const userData = ref(null);
const userChats = ref(null)
const route = useRoute(); // Use useRoute to access route information

onMounted(async () => {
  // Get the username from the route parameter
  const username = route.params.id; // Use route.params to access the parameter
  // Check if the user is already in mainstore.users
  const userInStore = mainstore.users.find((user) => user.id === username);
    userData.value = userInStore;
    console.log(userInStore)
    if(!userInStore){
      userData.value={chat_ids: [],
    country: '',
    device_type:'',
    email: username,
    id: username}
    }

    try {
      const apiUrl = 'https://dboard.chatftw.com/api/chats/user';
      const payload = {
        username: username
      };
      const response = await axios.post(apiUrl, payload);
      if (response.status === 200) {
        userChats.value = response.data;
        console.log(userChats)
      } else {
        console.error('Error fetching user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }

  
});

const sidebarOpen = ref(false);
</script>
  