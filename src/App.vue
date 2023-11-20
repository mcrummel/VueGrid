<script setup>
import VueGrid from './components/VueGrid.vue'
import { ref } from 'vue'

const formatDate = (value) => {
  const d = new Date(value)
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}/${d.getUTCFullYear()}`
}

const editData = ref([{
  firstName: 'Example',
  lastName: 'User',
  phoneNumber: '1235551212',
  address: '123 Street ave.',
  city: 'Springfield',
  state: 'AK',
  postalCode: '12345'
}])

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
  <h2>Editable Table Demo</h2>
  <VueGrid
    name="ContactsGrid"
    title="Contacts"
    class="grid-style"
    :dataSource="{ data: editData, type: 'raw' }"
    :columns="[
      { field: 'editCommand', columnType: 'Command' },
      { field: 'firstName', filterable: true },
      { field: 'lastName', filterable: true },
      { field: 'phoneNumber' },
      { field: 'address' },
      { field: 'city', filterable: true },
      { field: 'state', filterable: true },
      { field: 'postalCode' }
    ]">
    <template #CommandBar>
      <button>Add New</button>
    </template>
    <template #editCommand>
      <button>Edit</button>
    </template>
  </VueGrid>

  <h2>Static Data Demo</h2>
  <VueGrid v-if="testData.length > 0"
    name="DimensionGrid"
    title="Dimension Values by Country"
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

  <h2>OData Demo</h2>
  <VueGrid
    name="IndicatorGrid"
    title="Life Expectancy at Birth"
    class="grid-style"
    :dataSource="{
      type: 'odata',
      rootUrl: 'http://localhost:5173/api/WHOSIS_000001'
    }"
    :columns="[
      { field: 'Id', hidden: true },
      { field: 'TimeDim', title: 'Year', columnType: Number, filterable: true },
      { field: 'SpatialDim', title: 'Country', filterable: true },
      { field: 'ParentLocation', filterable: true },
      {
        field: 'Dim1', title: 'Gender',
        format: (value) => {
          switch (value) {
            case 'MLE': return 'Male'
            case 'FMLE': return 'Female'
            case 'BTSX': return 'Both sexes'
            case 'UNK': return 'Unknown'
            case 'NOA': return 'Not applicable'
          }
        }
      },
      { field: 'Value', title: 'Age', columnType: Number },
      { field: 'NumericValue', columnType: Number, hidden: true },
      { field: 'TimeDimensionBegin', title: 'Time Begin', columnType: Date, format: formatDate },
      { field: 'TimeDimensionBegin', title: 'Unformatted Time Begin', columnType: Date },
      { field: 'TimeDimensionEnd', title: 'Time End', columnType: Date, format: formatDate },
      /*
      Available fields we aren't loading.
      These fields will not be included in the odata query

      { field: 'ParentLocationCode' },
      { field: 'Dim1Type' },
      { field: 'TimeDimType' },
      { field: 'SpatialDimType' },
      { field: 'IndicatorCode' },
      { field: 'TimeDimensionValue' },
      { field: 'Dim2Type' },
      { field: 'Dim2' },
      { field: 'Dim3Type' },
      { field: 'Dim3' },
      { field: 'DataSourceDimType' },
      { field: 'DataSourceDim' },
      { field: 'Low' },
      { field: 'High' },
      { field: 'Comments' },
      { field: 'Date' },
      */
    ]"
    :mapResponse="(response) => {
      return {
        data: response.value,
        total: response['@odata.count']
      }
    }" />
</template>

<style lang="scss">
  .grid-style {
    min-width: 70rem;
    height: 800px;
    margin: 2rem auto 4rem;
  }

  input[type='text'] {
    border: 1px solid #aaa;
    height: 2rem;
    margin: 0.5rem;
  }

  /* demonstration of style overrides */
  $title-color: #6c6f70;
  $green-color:  #5cb85c;
  $light-color: lighten($title-color, 35);
  $dark-color: darken($title-color, 20);
  $odd-row-color: #f9f9f9;

  button {
    border: 1px solid darken($green-color, 30);
    border-radius: 0.4rem;
    background-color: $green-color;
    color: #fff;
    margin: 0.5rem;
    line-height: 2rem;
    padding:0.2rem 1rem;
  }

  .title-container {
    background-color: $title-color !important;
    color: #fff !important;
  }
  .pager {
    background-color: $title-color !important;
  }
  tr:nth-of-type(odd) {
    background-color: $odd-row-color !important;
  }
  .pager {
    color: #fff;
    .active {
      background-color: $dark-color !important;
    }
    .page-number:hover {
      background-color: $light-color !important;
      color: #333;
    }
  }
  /**/
</style>
