<template>
                          <div class="py-2 px-4 w-fit mb-8 ml-4 text-green-500 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">

<router-link :to="`/users`" class="flex flex-nowrap">
    <svg class="w-4 h-4 mt-2 shrink-0 ml-1 fill-current rotate-90"
    viewBox="0 0 12 12">
    <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
</svg>
<h1 class="text-xl">
    back
</h1>
</router-link>
</div>
            <div class="flex justify-around flex-wrap overflow-hidden p-10 mb-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 dark:text-white text-black">
              <h1 class="lg:text-xl">id: <span class="text-green-500"> {{ userData.id }} </span></h1>
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
    