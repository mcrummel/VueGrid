<script setup>
import Grid from './grid'

const props = defineProps({
  name: {
    type: String
  },
  rootUrl: {
    type: String,
    required: true
  },
  parseResponse: {
    type: Function
  },
  columns: {
    type: Array,
    required: true
  },
  pageSize: {
    type: Number
  }
})

const grid = new Grid(
  props.rootUrl,
  props.columns,
  props.parseResponse,
  props.pageSize
)

// formatters
const formatLabel = (label, value) => label || value[0].toUpperCase() + value.slice(1)
const applyCustomFormatting = (field, row, formatter) => {
  return formatter ? formatter(row[field], row) : row[field]
}

// created
grid.getData()
</script>

<template>
  <div @grid-created="grid.getData">
    <table :id="props.name" class="grid">
      <thead>
        <tr>
          <th v-for="column in grid.columns.value" :key="column.index" @click="grid.sort(column)">
            {{ formatLabel(column.label, column.field) }}
            <span v-if="column.sortDirection === 'ASC'">&#x2191;</span>
            <span v-else-if="column.sortDirection === 'DESC'">&#x2193;</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in grid.data.value" :key="row.id">
          <td v-for="{field, formatter} in grid.columns.value" :key="field">
            {{ applyCustomFormatting(field, row, formatter) }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td :colspan="grid.columns.value.length">
            <button @click="getData">Refresh</button>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style lang="scss" scoped>
  table {
    border-collapse: collapse;
    td, th {
      border: 1px #ddd solid;
      padding: 0.5rem 1rem;
    }
    th {
      font-weight: bold;
      cursor: pointer;
    }
    tbody {
      tr:nth-of-type(odd) {
        background-color:#f9f9f9
      }
    }
  }
</style>
