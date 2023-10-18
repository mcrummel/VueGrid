<script setup>
import VueGrid from './components/VueGrid.vue'
</script>

<template>
  <VueGrid
    name="TestGrid"
    title="Dimension Values by Country"
    rootUrl="http://localhost:5174/api/Dimension/country/DimensionValues"
    :columns="[
      { field: 'Code' },
      { field: 'Title' },
      { field: 'ParentDimension', title: 'Parent Dimension' },
      { field: 'Dimension' },
      { field: 'ParentCode', title: 'Parent Code' },
      { field: 'ParentTitle', title: 'Parent Title' }
    ]"
    :mapResponse="(response) => {
      return {
        data: response.value,
        total: response['@odata.count']
      }
    }"
  />
</template>

<style scoped>
</style>
