<template>
    <div class="flex h-screen overflow-hidden">
        <!-- Sidebar -->
        <Sidebar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />

        <!-- Content area -->
        <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <!-- Site header -->
            <Header :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

            <main>
                <div class="py-8 w-full mx-auto">
                    <div v-if="chat">
                        <div class="py-2 px-4 w-fit mb-8 ml-4 text-green-500 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">

                            <router-link :to="`/user/${chat.user}`" class="flex flex-nowrap">
                                <svg class="w-4 h-4 mt-2 shrink-0 ml-1 fill-current rotate-90"
                                viewBox="0 0 12 12">
                                <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                            </svg>
                            <h1 class="text-xl">
                                back
                            </h1>
                        </router-link>
                    </div>
                        <div
                            class="mx-auto max-w-7xl gap-10 flex justify-around flex-wrap overflow-hidden p-10 mb-10 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 dark:text-white text-black">
                            <h1 class="lg:text-xl">Name: <span class="text-green-500"> {{ chat.chat_name }} </span></h1>
                            <p class="lg:text-lg">UserName: <span class="text-green-500">{{ chat.user }} </span></p>
                            <p class="lg:text-lg">errorRate: <span class="text-green-500">{{ chat.errorRate }}</span></p>
                            <p class="lg:text-lg">lastAccessed: <span class="text-green-500">{{ new
                                Date(chat.lastAccessed).toLocaleString() }}</span></p>
                            <p class="lg:text-lg">like count: <span class="text-green-500">{{ chat.likeCount }}</span></p>
                            <p class="lg:text-lg">dislike count: <span class="text-green-500">{{ chat.dislikeCount }}</span>
                            </p>
                        </div>
                        <!-- Display user data here -->
                        <div v-for="message in chat.messages.slice().reverse()">
                            <div class="w-full py-5 shadow-lg"
                                :class="message.likeStatus === 'like' ? 'bg-green-500/20' : message.likeStatus === 'dislike' ? 'bg-red-500/20' : message.sender === 'user' ? 'bg-white dark:bg-slate-800' : ''">
                                <p class="max-w-3xl mx-auto ">{{ message.content }}</p>
                                <p class="max-w-3xl mx-auto text-end text-black dark:text-white text-xs">{{ new
                                    Date(message.time).toLocaleString() }}</p>
                            </div>
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
const mainstore = useMainStore();

// Define a ref for user data
const chat = ref(null)
const route = useRoute(); // Use useRoute to access route information

onMounted(async () => {
    const username = route.params.usr;
    const chatId = route.params.id;
    console.log(username, chatId)

    try {
        const apiUrl = 'https://dboard.chatftw.com/api/chats/user';
        const payload = {
            username: username
        };
        const response = await axios.post(apiUrl, payload);
        if (response.status === 200) {
            const userChats = response.data;
            chat.value = userChats.find((chat) => chat.chat_id == chatId)

        } else {
            console.error('Error fetching user data');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }


});

const sidebarOpen = ref(false);
</script>
  