<script setup lang="ts">
import { VueGrid, RawDataSource } from '../../lib/vue-grid'
import { ref } from 'vue'

const testData = ref([])
const dataSource = ref(new RawDataSource(testData))
const testDataLimit = ref(0)

// get all records from the service to populate DimensionGrid's data object
const loadInitialData = (): void => {
  console.log(`Fetching dimension data limit: ${(testDataLimit.value === undefined) || 0}`)
  fetch('http://localhost:5173/api/Dimension/country/DimensionValues?$count=true', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
    .then(async (response) => await response.json())
    .then((response) => {
      const data = (!Number.isNaN(testDataLimit.value))
        ? response.value.slice(0, testDataLimit.value)
        : response.value

      testData.value = data
      testDataLimit.value = data.length
      console.log('Data retrieved')
    })
    .catch(console.log)
}

testDataLimit.value = 20
loadInitialData()
</script>

<template>
  <VueGrid
    v-if="testData.length > 0"
    name="DimensionGrid"
    title="Dimension Values by Country (Static Data)"
    class="grid-style"
    :data-source="dataSource"
    :columns="[
      { field: 'Code', filterable: true },
      { field: 'Title', filterable: true },
      { field: 'ParentDimension' },
      { field: 'Dimension' },
      { field: 'ParentCode', filterable: true },
      { field: 'ParentTitle', filterable: true }
    ]"
  >
    <template #CommandBar>
      <span>Record Limit:</span>
      <input
        v-model="testDataLimit"
        type="text"
        style="width: 2rem; text-align:center;"
      >
      <button @click="loadInitialData();">
        Refresh Data
      </button>
    </template>

    <template #Dimension="{ Code, Dimension }: any">
      <a href="#">{{ Dimension }}</a> ({{ Code }})
    </template>

    <template #ParentCode="{ ParentCode }: any">
      <span style="color:red;">{{ ParentCode }}</span>
    </template>
  </VueGrid>
</template>
