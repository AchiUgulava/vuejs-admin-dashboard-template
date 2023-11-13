
<script>
import { ref, onMounted } from 'vue';
import router from '../../router';
import axios from 'axios';
import { useMainStore } from '../../stores/main';
import SearchInput from './SearchInput.vue'
export default {
  name: 'List',
  components: {
    SearchInput
  },
  setup() {
    const mainStore = useMainStore();
    const users = ref(mainStore.users);
    const sortBy = ref({
      name: 'email',
      asc: true
    });
    const hi = ref("hi")
    const filterField = ref('')
    const filterValue = ref('')
    const columns = ['user_id', 'email', 'chat_count', 'timestamp', 'registration_date'];
    const page = ref(0);
    const incrementPage = async (bool) => {
      bool ? (page.value +1) * 50 < totalNumOfUsers.value && page.value++ : page.value > 0 && page.value--;
      console.log(page.value)
      await retrieveData()
    }
    const totalNumOfUsers = ref(0)

    const fetchUsers = async (name, asc, page) => {
      const postData = {
        sortby: { name: name || "last_login", asc: asc ? "asc" : "desc" },
        page: page
      };
      const apiUrl = import.meta.env.VITE_API_ENDPOINT + '/users/getSorted';
      return axios.post(apiUrl, postData)
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          console.error(error);
          return "err"
        });
    };
    const fetchFiltered = async (name, asc, page, filterField, filterValue) => {
      const postData = {
        sortby: { name: name || "last_login", asc: asc ? "asc" : "desc" },
        page: page,
        filterField: filterField, // The name of the field to filter by (e.g., "username", "email")
        filterValue: filterValue  // The value to filter for in the field (e.g., a substring of the username)
      };
      const apiUrl = import.meta.env.VITE_API_ENDPOINT + '/users/getFilteredAndSorted';
      return axios.post(apiUrl, postData)
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          console.error(error);
          return "err"
        });
    };


    const retrieveData = async () => {
      totalNumOfUsers.value = await getDocumentCount(filterField.value,filterValue.value)
      if (filterField.value != "")
      {
        users.value = await fetchFiltered(sortBy.value.name, sortBy.value.asc, page.value,filterField.value,filterValue.value)

      }
      else{
        users.value = await fetchUsers(sortBy.value.name, sortBy.value.asc, page.value)
      }
      mainStore.users = users.value;
    };

    const getDocumentCount = async (filterField,filterValue) => {
      const postData = {
        filterField:filterField,
        filterValue:filterValue,
      }
      const apiUrl = import.meta.env.VITE_API_ENDPOINT + '/users/count';
      return axios.post(apiUrl, postData)
        .then(function (response) {
          console.log(response.data.count);
          return response.data.count;
        })
        .catch(function (error) {
          console.error(error);
          return "err"
        });
    };

    const redirectToUser = (user) => {
      router.push(`/user/${user}/`);
    };
    const handleSortBy = (id) => {
      console.log(sortBy.value.name, columns[id])
      if (sortBy.value.name == columns[id]) {
        sortBy.value.asc = !sortBy.value.asc
        console.log("toggle", sortBy.value.asc)
      }
      else {
        sortBy.value.name = columns[id];
        sortBy.value.asc = true;
      }
      retrieveData()
    }
    const handleSearch = async (searchQuery) => {
      console.log(searchQuery)
      filterValue.value = searchQuery;
      filterField.value = "email"
      retrieveData()
    }
    onMounted(async () => {
      await retrieveData();
    });

    return {
      redirectToUser,
      users,
      handleSortBy,
      sortBy,
      columns,
      incrementPage,
      page,
      totalNumOfUsers,
      handleSearch,
      filterField,
      filterValue
    };
  },
};
</script>
<template>
  <div
    class="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
    <header class="px-5 py-4 border-b border-slate-100 dark:border-slate-700 sm:flex ">
      <div class="px-3">
        <h2 class="font-semibold text-slate-800 dark:text-slate-100">Users</h2>
        <h3>{{ totalNumOfUsers }}</h3>
      </div>
      <SearchInput @onSearch="handleSearch" />

      <div class="flex w-full h-8 justify-end items-end">
        <img @click="incrementPage(false)" src="/src/images/icon-02.svg" alt="prev" class="rotate-180"
          :class="page === 1 ? 'opac                                                    ity-30 cursor-default' : 'cursor-pointer'">
        <h1 class="text-2xl w-16 text-center">{{ page + 1 }}/{{ Math.ceil( totalNumOfUsers/ 50) }}</h1>
        <img @click="incrementPage(true)" src="/src/images/icon-02.svg" alt="net" class="cursor-pointer"
          :class="(page + 1) * 50 > totalNumOfUsers ? 'opacity-30 cursor-default' : 'cursor-pointer'">


      </div>
    </header>
    <div class="p-3">
      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="table-auto w-full">
          <!-- Table header -->
          <thead
            class="text-xs font-semibold uppercase dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50">
            <tr>
              <th class="p-2 whitespace-nowrap ">
                <div class="font-semibold text-left flex cursor-pointer  " @click="handleSortBy(0)">
                  <p>id</p>
                  <div v-if="sortBy.name == columns[0]" :class="sortBy.asc && 'pt-1'">

                    <svg v-if="sortBy.asc" class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 rotate-180"
                      viewBox="0 0 12 12">
                      <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                    </svg>

                    <svg v-else class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400" viewBox="0 0 12 12">
                      <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                    </svg>

                  </div>
                </div>

              </th>
              <th class="p-2 whitespace-nowrap ">
                <div class="font-semibold text-left flex cursor-pointer  " @click="handleSortBy(1)">
                  <p>Email</p>
                  <div v-if="sortBy.name == columns[1]" :class="sortBy.asc && 'pt-1'">

                    <svg v-if="sortBy.asc" class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 rotate-180"
                      viewBox="0 0 12 12">
                      <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                    </svg>

                    <svg v-else class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400" viewBox="0 0 12 12">
                      <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                    </svg>

                  </div>
                </div>

              </th>
              <th class="p-2 whitespace-nowrap ">


                <div class="font-semibold text-left flex cursor-pointer  " @click="handleSortBy(2)">
                  <p>Chat Count</p>
                  <div v-if="sortBy.name == columns[2]" :class="sortBy.asc && 'pt-1'">

                    <svg v-if="sortBy.asc" class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 rotate-180"
                      viewBox="0 0 12 12">
                      <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                    </svg>

                    <svg v-else class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400" viewBox="0 0 12 12">
                      <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                    </svg>

                  </div>
                </div>
              </th>
              <th class="p-2 whitespace-nowrap ">
                <div class="font-semibold text-left flex cursor-pointer  " @click="handleSortBy(3)">
                  <p>Last Login</p>
                  <div v-if="sortBy.name == columns[3]" :class="sortBy.asc && 'pt-1'">

                    <svg v-if="sortBy.asc" class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 rotate-180"
                      viewBox="0 0 12 12">
                      <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                    </svg>

                    <svg v-else class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400" viewBox="0 0 12 12">
                      <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                    </svg>

                  </div>
                </div>

              </th>
              <th class="p-2 whitespace-nowrap ">
                <div class="font-semibold text-left flex cursor-pointer  " @click="handleSortBy(4)">
                  <p>Registered At</p>
                  <div v-if="sortBy.name == columns[4]" :class="sortBy.asc && 'pt-1'">

                    <svg v-if="sortBy.asc" class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 rotate-180"
                      viewBox="0 0 12 12">
                      <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                    </svg>

                    <svg v-else class="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400" viewBox="0 0 12 12">
                      <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                    </svg>

                  </div>
                </div>

              </th>

            </tr>
          </thead>
          <!-- Table body -->
          <tbody class="text-sm divide-y divide-slate-100 dark:divide-slate-700">
            <tr v-for="user in users" :key="user.user_id" @click.prevent="redirectToUser(user.email)"
              class="cursor-pointer hover:opacity-80 hover:bg-slate-50 dark:hover:bg-slate-700">
              <td class="p-2 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="font-medium text-slate-800 dark:text-slate-100">{{ user.user_id }}</div>
                </div>
              </td>
              <td class="p-2 whitespace-nowrap">
                <div class="text-left">{{ user.email }}</div>
              </td>
              <td class="p-2 whitespace-nowrap">
                <div class="text-left font-medium text-green-500">{{ user.chat_count }}</div>
              </td>
              <td class="p-2 whitespace-nowrap">
                <div v-if="user.last_login" class="text-left font-medium text-green-500">
                  {{ user.timestamp }}
                </div>
                <div v-else class="text-left font-medium text-green-500">unknown</div>
              </td>
              <td class="p-2 whitespace-nowrap">
                <div v-if="user.registration_date" class="text-left font-medium text-green-500">
                  {{ user.registration_date }}
                </div>
                <div v-else class="text-left font-medium text-green-500">unknown</div>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  </div>
  <div class="flex w-full h-8 justify-end items-end">
        <img @click="incrementPage(false)" src="/src/images/icon-02.svg" alt="prev" class="rotate-180"
          :class="page === 1 ? 'opac                                                    ity-30 cursor-default' : 'cursor-pointer'">
        <h1 class="text-2xl w-16 text-center">{{ page + 1 }}</h1>
        <img @click="incrementPage(true)" src="/src/images/icon-02.svg" alt="net" class="cursor-pointer"
          :class="(page + 1) * 50 > totalNumOfUsers ? 'opacity-30 cursor-default' : 'cursor-pointer'">


      </div>
</template>
