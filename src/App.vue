<script setup>
import VueGrid from './components/VueGrid.vue'
</script>

<template>
  <VueGrid
    rootUrl="http://localhost:5174/api/parts"
    :parseResponse="(response) => {
      const records = []
      Object.keys(response).forEach(key => {
        records.push(...response[key].map(v => v))
      })

      return {
        data: records,
        count: records.length
      }
    }"
    :columns="[
      {
        field: 'id',
        formatter: (value, row) => `${row.type[0].toUpperCase()}${row.type.slice(1,-1)}_${value}`
      },
      { field: 'description' },
      { field: 'title' },
      { field: 'src', label:'Source' },
      { field: 'type' },
      {
        field: 'cost',
        formatter: (value) => `$${value.toFixed(2)}`
      }
    ]"
  />
</template>

<style scoped>
</style>
