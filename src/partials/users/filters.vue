<template>
  <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-10 py-10">
    <div
      class="bg-white dark:bg-slate-800 shadow-lg rounded-lg border border-slate-200 dark:border-slate-700 h-full p-4 flex items-center flex-col gap-5">
      <button @click="toggleFilter('country')">Country</button>
      <div v-if="filters.country.active">
        <v-select class="w-full" v-model="filters.country.value" :items="countries" chips label="Chips" multiple></v-select>
        <button @click="filterData(filters.country, 'country')">Filter Data</button>
      </div>
    </div>
    <div
      class="bg-white dark:bg-slate-800 shadow-lg rounded-lg border border-slate-200 dark:border-slate-700 h-full p-4 flex items-center flex-col gap-5">
      <button @click="toggleFilter('registrationDate')">Registration Date</button>
      <div v-if="filters.registrationDate.active">
        <DatePicker class="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 dark:text-white"
          v-model.range="filters.registrationDate" />
        <button @click="filterData(filters.registrationDate, 'registrationDate')">Filter Data</button>
      </div>
    </div>
    <!-- Add more filters as needed -->
  </div>
</template>

<script>
export default {
  props: {
    filters: {
      type: Object,
      default: () => ({}),
    },
    countries: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    toggleFilter(filterName) {
      this.$set(this.filters[filterName], 'active', !this.filters[filterName].active);
    },
    filterData(filter, filterName) {
      this.$emit('filter-data', { filterName, filter });
    },
  },
};
</script>