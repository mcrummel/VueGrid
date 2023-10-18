<script setup>
import VueGrid from './components/VueGrid.vue'
</script>

<template>
  <VueGrid
    name="TestGrid"
    title="Dimension Values by Country"
    class="grid-style"
    rootUrl="http://localhost:5173/api/Dimension/country/DimensionValues"
    :columns="[
      { field: 'Code', filterable: true },
      { field: 'Title', filterable: true },
      { field: 'ParentDimension', title: 'Parent Dimension' },
      { field: 'Dimension' },
      { field: 'ParentCode', title: 'Parent Code', filterable: true },
      { field: 'ParentTitle', title: 'Parent Title', filterable: true }
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
