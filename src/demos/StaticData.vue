<script setup>
import VueGrid from '../components/VueGrid.vue'
import { ref } from 'vue'

const testData = ref([])
const testDataLimit = ref(0)

// get all records from the service to populate DimensionGrid's data object
const loadInitialData = async () => {
  console.log(`Fetching dimension data limit: ${testDataLimit.value || 0}`)
  return await fetch('http://localhost:5173/api/Dimension/country/DimensionValues?$count=true', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  })
    .then((response) => response.json())
    .then((response) => {
      const data = testDataLimit.value
        ? response.value.slice(0, testDataLimit.value)
        : response.value

      testData.value = data
      testDataLimit.value = data.length
      console.log('Data retrieved')
    })
    .catch(console.log)
}

loadInitialData()
</script>

<template>
    <VueGrid v-if="testData.length > 0"
        name="DimensionGrid"
        title="Dimension Values by Country (Static Data)"
        class="grid-style"
        :dataSource="{ data: testData }"
        :columns="[
          { field: 'Code', filterable: true },
          { field: 'Title', filterable: true },
          { field: 'ParentDimension' },
          { field: 'Dimension' },
          { field: 'ParentCode', filterable: true },
          { field: 'ParentTitle', filterable: true }
        ]">
        <template #CommandBar>
          <span>Record Limit:</span>
          <input type="text" v-model="testDataLimit" style="width: 2rem; text-align:center;">
          <button @click="loadInitialData(20);">Refresh Data</button>
        </template>

        <template #Dimension="{ Code, Dimension }">
          <a href="#">{{ Dimension }}</a> ({{Code}})
        </template>

        <template #ParentCode="{ ParentCode }">
          <span style="color:red;">{{ ParentCode }}</span>
        </template>
    </VueGrid>
</template>
