<script setup>
import VueGrid from './components/VueGrid.vue'
</script>

<template>
  <VueGrid
    name="DimensionGrid"
    title="Dimension Values by Country"
    class="grid-style"
    rootUrl="http://localhost:5173/api/Dimension/country/DimensionValues"
    :columns="[
      { field: 'Code', filterable: true },
      { field: 'Title', filterable: true },
      { field: 'ParentDimension' },
      { field: 'Dimension' },
      { field: 'ParentCode', filterable: true },
      { field: 'ParentTitle', filterable: true }
    ]"
    :mapResponse="(response) => {
      return {
        data: response.value,
        total: response['@odata.count']
      }
    }"
  />

  <VueGrid
    name="IndicatorGrid"
    title="Life Expectancy at Birth"
    class="grid-style"
    rootUrl="http://localhost:5173/api/WHOSIS_000001"
    :columns="[
      { field: 'Id', hidden: true },
      { field: 'TimeDim', title: 'Year', dataType: Number, filterable: true },
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
      { field: 'Value', title: 'Age', dataType: Number },
      { field: 'NumericValue', dataType: Number, hidden: true },
      /*
      Available fields we aren't loading.
      These fields will not be included in the odata query

      { field: 'ParentLocationCode' },
      { field: 'Dim1Type' },
      { field: 'TimeDimType' },
      { field: 'SpatialDimType' },
      { field: 'IndicatorCode' },
      { field: 'TimeDimensionValue' },
      { field: 'TimeDimensionBegin' },
      { field: 'TimeDimensionEnd' },
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
    }"
  />
</template>

<style lang="scss">
  .grid-style {
    min-width: 70rem;
    height: 800px;
    margin: 2rem auto;
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
