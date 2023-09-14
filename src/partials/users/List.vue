<template>
  <div class="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
    <header class="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
      <h2 class="font-semibold text-slate-800 dark:text-slate-100">Customers</h2>
    </header>
    <div class="p-3">
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="table-auto w-full">
          <!-- Table header -->
          <thead class="text-xs font-semibold uppercase dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50">
            <tr>
              <th class="p-2 whitespace-nowrap">
                <div class="font-semibold text-left">Name</div>
              </th>
              <th class="p-2 whitespace-nowrap">
                <div class="font-semibold text-left">Email</div>
              </th>
              <th class="p-2 whitespace-nowrap">
                <div class="font-semibold text-left">Device Type</div>
              </th>
              <th class="p-2 whitespace-nowrap">
                <div class="font-semibold text-left">Country</div>
              </th>
              <th class="p-2 whitespace-nowrap">
                <div class="font-semibold text-left">Chats</div>
              </th>
            </tr>
          </thead>
          <!-- Table body -->
          <tbody class="text-sm divide-y divide-slate-100 dark:divide-slate-700">
            <tr v-for="customer in customers" :key="customer.id" @click.prevent="redirectToUser(customer.user)" class="cursor-pointer hover:opacity-80 hover:bg-slate-50 dark:hover:bg-slate-700">
              <td class="p-2 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="font-medium text-slate-800 dark:text-slate-100">{{ customer.user }}</div>
                </div>
              </td>
              <td class="p-2 whitespace-nowrap">
                <div class="text-left">{{ customer.email }}</div>
              </td>
              <td class="p-2 whitespace-nowrap">
                <div class="text-left font-medium text-green-500">{{ customer.device_type }}</div>
              </td>
              <td class="p-2 whitespace-nowrap">
                <div class="text-left font-medium text-green-500">{{ customer.country }}</div>
              </td>
              <td class="p-2 whitespace-nowrap">
                <router-link :to="`/user/${customer.user}`">
                  <div class="text-left font-medium text-green-500">{{ customer.chat_ids.length }}</div>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import router from '../../router';
import axios from 'axios';
import { useMainStore } from '../../stores/main';

export default {
  name: 'DashboardCard10',
  setup() {
    const mainStore = useMainStore();
    const customers = ref(mainStore.users);

    const fetchCustomers = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_ENDPOINT + '/api/users';
        const response = await axios.post(apiUrl);
        customers.value = response.data;
        mainStore.users = response.data;
      } catch (error) {
        customers.value= mainStore.users
        console.error('Error fetching user data:', error);
      }
    };
    const redirectToUser = (username) => {
      router.push(`/user/${username}`);
    };

    onMounted(() => {
      // fetchCustomers();
      console.log(import.meta.env.VITE_API_ENDPOINT)
    });

    return {
      redirectToUser,
      customers,
    };
  },
};
</script>
