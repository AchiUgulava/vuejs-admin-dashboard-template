<template>
            <div class="flex justify-around flex-wrap overflow-hidden p-10 mb-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 dark:text-white text-black">
              <h1 class="lg:text-xl">Username: <span class="text-green-500"> {{ userData.user }} </span></h1>
              <p class="lg:text-lg">Email: <span class="text-green-500">{{ userData.email }} </span></p>
              <p class="lg:text-lg">Device: <span class="text-green-500">{{ userData.device_type }}</span></p>
              <p class="lg:text-lg">Location: <span class="text-green-500">{{ userData.country }}</span></p>
            </div>
  </template>
    
  <script setup>
  import { ref, onMounted } from 'vue';
  const props = defineProps({
    userData:{
        type:Object,
        required:true
    }
  })
  
  </script>
    