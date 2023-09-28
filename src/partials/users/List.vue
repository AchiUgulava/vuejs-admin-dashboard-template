
<script>
import { ref, onMounted } from 'vue';
import router from '../../router';
import axios from 'axios';
import { useMainStore } from '../../stores/main';
import { db } from "../../firebaseInit.js";
export default {
  name: 'List',
  setup() {
    const mainStore = useMainStore();
    const customers = ref(mainStore.users);
    const sortBy = ref({
      name: 'email',
      asc: true
    });
    const columns = ['id', 'email', 'message_count', 'timestamp', 'registration_date'];
    const page = ref(0);

    const incrementPage = async (bool) => {
      bool ? page.value++ : page.value > 0 && page.value--;
      await retrieveData(page.value)
    }
    const totalNumOfUsers = ref(0)

    // const retrieveData = async (page) => {
    //   try {
    //     console.log(sortBy.value.name);

    //     const usersCollection = db.collection("users");

    //     let query = usersCollection;

    //     if (sortBy.value.name) {
    //       // const [field, direction] = sortBy.split(":");
    //       // query = query.orderBy(field, direction === "desc" ? "desc" : "asc");
    //       query = query.orderBy(sortBy.value.name , sortBy.value.asc?  "asc" : "desc");
    //     }

    //     if (page) {
    //       try{

    //         const startAfterDoc = await usersCollection
    //         .orderBy(sortBy.value.name || "createdAt")
    //         .limit((page) * 50)
    //         .get()
    //         .then((snapshot) => snapshot.docs[snapshot.docs.length - 1]);

    //         query = query.startAfter(startAfterDoc);
    //       }
    //       catch(err){
    //           console.log(err)
    //       }
    //     }
    //     try{

    //       const querySnapshot = await query.limit(50).get();

    //       const usersArray = [];
    //       querySnapshot.forEach((doc) => {
    //         usersArray.push({ id: doc.id, ...doc.data() });
    //       });

    //       console.log(sortBy.value.name, usersArray);
    //       customers.value = usersArray;
    //       mainStore.users = usersArray;
    //     }
    //     catch(err){
    //     console.error(err);

    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

    const retrieveData = async () => {
      getDocumentCount(sortBy.value.name)
      try {
        const usersCollection = db.collection('users');
        let query = usersCollection;
        const direction = sortBy.value.asc ?  "asc":"desc"
        if (page.value > 0) {
          const startAfterDoc = await usersCollection
            .orderBy(sortBy.value.name, direction)
            .limit((page.value) * 50)
            .get()
            .then((snapshot) => snapshot.docs[snapshot.docs.length - 1].data());
          // .then((snapshot) => snapshot.docs[snapshot.docs.length - 1].data().sortBy.value.name);
            console.log(startAfterDoc)
          query = query.orderBy(sortBy.value.name, direction).startAfter(startAfterDoc.email);
        } else {
          query = query.orderBy(sortBy.value.name, direction);
        }

        const querySnapshot = await query.limit(50).get();

        const usersArray = [];
        querySnapshot.forEach((doc) => {
          usersArray.push({ id: doc.id, ...doc.data() });
        });
        customers.value = usersArray;
        mainStore.users = usersArray;
        console.log(usersArray);
      } catch (error) {
        console.error(error);
        return [];
      }
    };

    const getDocumentCount = async (orderByField) => {
      const query = db.collection('users').orderBy(orderByField);
      try{

        const snapshot = await query.get();
        const count = snapshot.size;
        console.log(count)
        totalNumOfUsers.value = count
        return count;
      }
      catch(err){
        console.log(err)
      }
    };

    // const fetchCustomers = async () => {
    //   try {
    //     const apiUrl = import.meta.env.VITE_API_ENDPOINT + '/api/users';
    //     const response = await axios.post(apiUrl);
    //     customers.value = response.data;
    //     mainStore.users = response.data;
    //   } catch (error) {
    //     customers.value = mainStore.users
    //     console.error('Error fetching user data:', error);
    //   }
    // };
    const redirectToUser = (username) => {
      router.push(`/user/${username}`);
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

    onMounted(async () => {
      mainStore.users.length > 2 || await retrieveData();
      console.log(import.meta.env.VITE_API_ENDPOINT)
      


    });

    return {
      redirectToUser,
      customers,
      handleSortBy,
      sortBy,
      columns,
      incrementPage,
      page,
      totalNumOfUsers,
    };
  },
};
</script>
<template>
  <div
    class="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
    <header class="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex ">
      <div>
        <h2 class="font-semibold text-slate-800 dark:text-slate-100">Users</h2>
        <h3>{{ totalNumOfUsers }}</h3>
      </div>
      <div class="flex w-full h-8 justify-end items-end">
        <img @click="incrementPage(false)" src="/src/images/icon-02.svg" alt="prev" class="rotate-180"
          :class="page === 0 ? 'opacity-30 cursor-default' : 'cursor-pointer'">
        <h1 class="text-2xl w-16 text-center">{{ page + 1 }}</h1>
        <img @click="incrementPage(true)" src="/src/images/icon-02.svg" alt="net" class="cursor-pointer">

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
                  <p>name</p>
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
            <tr v-for="customer in customers" :key="customer.id" @click.prevent="redirectToUser(customer.id)"
              class="cursor-pointer hover:opacity-80 hover:bg-slate-50 dark:hover:bg-slate-700">
              <td class="p-2 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="font-medium text-slate-800 dark:text-slate-100">{{ customer.id }}</div>
                </div>
              </td>
              <td class="p-2 whitespace-nowrap">
                <div class="text-left">{{ customer.email }}</div>
              </td>
              <td class="p-2 whitespace-nowrap">
                <div class="text-left font-medium text-green-500">{{ customer.message_count }}</div>
              </td>
              <td class="p-2 whitespace-nowrap">
                <div v-if="customer.timestamp" class="text-left font-medium text-green-500">{{ new
                  Date(customer.timestamp.toDate()).toLocaleString() }}</div>
                <div v-else class="text-left font-medium text-green-500">unknown</div>
              </td>
              <td class="p-2 whitespace-nowrap">
                <div v-if="customer.registration_date" class="text-left font-medium text-green-500">{{ new
                  Date(customer.registration_date.toDate()).toLocaleString() }}</div>
                <div v-else class="text-left font-medium text-green-500">unknown</div>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  </div>
  <div class="flex w-full h-10 justify-center items-center">
    <img @click="incrementPage(false)" src="/src/images/icon-02.svg" alt="prev" class="rotate-180"
      :class="page === 0 ? 'opacity-30 cursor-default' : 'cursor-pointer'">
    <h1 class="text-2xl w-16 text-center">{{ page + 1 }}</h1>
    <img @click="incrementPage(true)" src="/src/images/icon-02.svg" alt="net" class="cursor-pointer">

  </div>
</template>
