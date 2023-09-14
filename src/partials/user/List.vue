<template>
  <div class="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
    <header class="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
      <h2 class="font-semibold text-slate-800 dark:text-slate-100">chats</h2>
    </header>
    <div class="p-3">
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="table-auto w-full">
          <!-- Table header -->
          <thead class="text-xs font-semibold uppercase dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50">
            <tr>
              <th class="p-2 whitespace-nowrap">
                <div class="font-semibold text-left">Chat Name</div>
              </th>
              <th class="p-2 whitespace-nowrap">
                <div class="font-semibold text-left">last Accessed</div>
              </th>
              <th class="p-2 whitespace-nowrap">
                <div class="font-semibold text-left">messages</div>
              </th>
              <th class="p-2 whitespace-nowrap">
                <div class="font-semibold text-left">l/dl ratio</div>
              </th>
            </tr>
          </thead>
          <!-- Table body -->
          <tbody class="text-sm divide-y divide-slate-100 dark:divide-slate-700">
            <tr v-for="chat in chats" :key="chat.id" @click.prevent="redirectToChat(chat.chat_id)" class="cursor-pointer hover:opacity-80 hover:bg-slate-50 dark:hover:bg-slate-700">
              <td class="p-2 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="font-medium text-slate-800 dark:text-slate-100">{{ chat.chat_name }}</div>
                </div>
              </td>
              <td class="p-2 whitespace-nowrap">
                <div class="text-left text-slate-800 dark:text-slate-100">{{new Date(chat.lastAccessed).toLocaleString() }}</div>
              </td>
              <td class="p-2 whitespace-nowrap">
                <div class="text-left font-medium text-green-500">{{ chat.messages.length }}</div>
              </td>
              <td class="p-2 whitespace-nowrap">
                <div class="text-left font-medium text-green-500">{{ chat.likeCount }}/{{  chat.dislikeCount  }} </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import router from '../../router';

const props = defineProps({
  chats:{
    type:Array,
    required:true
  },
  usr:{
    type:String,
    required:true,
  }

})


const redirectToChat = (chat) => {
  router.push(`/user/${props.usr}/chat/${chat}`);
};

onMounted(() => {
  console.log(import.meta.env.VITE_API_ENDPOINT);
});

</script>
