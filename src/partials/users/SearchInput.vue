<template>
    <div class="flex">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="px-4 py-2 border-2 border-r-0 border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-l-md focus:outline-none  focus:border-blue-500"
      />
      <button
        @click="emitSearch"
        class="px-4 py-1 bg-blue-500 text-white  rounded-r-md hover:bg-blue-600 border-2 border-l-0 border-slate-200 dark:border-slate-700"
      >
        Search
      </button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchQuery: ''
      };
    },
    methods: {
      emitSearch() {
        this.$emit('onSearch', this.searchQuery);
      }
    }
  };
  </script>
  