
  
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
const fetchUser = async (email) => {
  const postData = {
    email: email
  };
  const apiUrl = import.meta.env.VITE_API_ENDPOINT + '/users/getByEmail';
  return axios.post(apiUrl, postData)
    .then(function (response) {
      console.log(response)
      userData.value = {
        chat_ids: [],
        country: response.data.country,
        email: response.data.email,
        id:response.data.user_id
        }
        userChats.value = response.data.Chats
      })
    .catch(function (error) {
      console.error(error);
      return "err"
    });
};

onMounted(async () => {
  // Get the username from the route parameter
  const email = route.params.usr; // Use route.params to access the parameter
  console.log(email)
  // Check if the user is already in mainstore.users
  const userInStore = mainstore.users.find((user) => user.id === email);
  userData.value = userInStore;
  if (!userInStore) {
    userData.value = {
      chat_ids: [],
      country: 'Loading...',
      device_type: 'Loading...',
      email: email,
      id: 'loading...'
    }
  }
await fetchUser(email)
});

const sidebarOpen = ref(false);
</script>
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
            <UserCard :userData="userData" />
            <!-- Add more user information as needed -->
            <List v-if="userChats" :usr="userData.email" :chats="userChats" />
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