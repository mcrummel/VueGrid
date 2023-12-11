<script setup lang="ts">
import { VueGrid, OdataDataSource } from '../../lib/vue-grid'

const formatDate = (value) => {
  const d = new Date(value)
  return `${d.getUTCMonth() + 1}/${d.getUTCDate()}/${d.getUTCFullYear()}`
}

const dataSource = new OdataDataSource('http://localhost:5173/api/WHOSIS_000001',
  (response) => {
    return {
      data: response.value,
      total: response['@odata.count']
    }
  }
)
</script>

<template>
    <VueGrid
      name="IndicatorGrid"
      title="Life Expectancy at Birth (Odata)"
      class="grid-style"
      :dataSource="dataSource"
      :columns="[
        { field: 'Id', hidden: true },
        { field: 'TimeDim', title: 'Year', columnType: 'number', filterable: true },
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
        { field: 'Value', title: 'Age', columnType: 'number' },
        { field: 'NumericValue', columnType: 'number', hidden: true },
        { field: 'TimeDimensionBegin', title: 'Time Begin', columnType: 'date', format: formatDate },
        { field: 'TimeDimensionBegin', title: 'Unformatted Time Begin', columnType: 'date' },
        { field: 'TimeDimensionEnd', title: 'Time End', columnType: 'date', format: formatDate },
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
      ]" />
</template>
../../lib/vue-grid